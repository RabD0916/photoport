package com.example.webphoto.service;

import com.example.webphoto.domain.Friendship;
import com.example.webphoto.domain.FriendshipStatus;
import com.example.webphoto.domain.User;
import com.example.webphoto.domain.enums.UserType;
import com.example.webphoto.dto.UserRequest;
import com.example.webphoto.dto.UserResponse;
import com.example.webphoto.dto.UserSearchResult;
import com.example.webphoto.repository.FriendshipRepository;
import com.example.webphoto.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final String path = "./front4/public/images/";


    // 이메일을 이용하여 사용자의 아이디를 찾는 메소드
    public String findUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)
                .orElse(null);
    }

    // dto를 user 엔티티로 저장
    private User requestToEntity(UserRequest dto) {
        validateUser(dto);

        String password = bCryptPasswordEncoder.encode(dto.getPassword());
        User.UserBuilder userBuilder = User.builder()
                .id(dto.getId())
                .password(password)
                .userNick(dto.getUserNick())
                .phone(dto.getPhone())
                .birth(dto.getBirth())
                .email(dto.getEmail())
                .userConn(LocalDateTime.now())
                .userProfile("/images/profile.png")
                .userAgree(true);

        if ("ADMIN".equals(dto.getId())) {
            userBuilder.userType(UserType.ADMIN);
        } else {
            userBuilder.userType(UserType.USER);
        }

        return userBuilder.build();
    }

    // 유저 데이터 검증
    private void validateUser(UserRequest dto) {
        if (userRepository.existsById(dto.getId())) {
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다.");
        }

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        if (userRepository.findByUserNick(dto.getUserNick()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }
    }

    // user 엔티티를 AddUserResponse Dto로 변환
    private UserResponse entityToResponse(User user) {
        return new UserResponse(user.getId(), user.getUserNick(), user.getUserProfile(), user.getEmail());
    }

    // 사용자를 추가하는 메소드
    public UserResponse addUser(UserRequest dto) {
        User user = userRepository.save(requestToEntity(dto));
        try {
            createDirectories(user.getId());
        } catch (IOException e) {
            log.error("디렉토리 생성 실패: " + user.getId(), e);
            throw new RuntimeException("사용자 디렉토리 생성에 실패했습니다.");
        }
        return entityToResponse(user);
    }

    // 사용자 디렉토리 생성
    private void createDirectories(String userId) throws IOException {
        String dir = path + userId;
        if (!new File(dir).mkdir() || !new File(dir + "/pose").mkdir()) {
            throw new IOException("Failed to create directories for user: " + userId);
        }
    }

    // 사용자 프로필을 수정하는 메소드
    public UserResponse updateUserProfile(String userId, String fileURL) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("해당 프로필이 없습니다."));

        user.setUserProfile(fileURL);
        return entityToResponse(userRepository.save(user));
    }


    // 사용자 닉네임을 수정하는 메소드
    public UserResponse updateUserNick(String userId, String userNick) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("해당 유저가 없습니다"));

        user.setUserNick(userNick);
        return entityToResponse(userRepository.save(user));
    }


    // 사용자를 삭제하는 메소드
    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with userId: " + userId));

        userRepository.delete(user);
        try {
            deleteDirectory(Paths.get(path + userId));
        } catch (IOException e) {
            log.error("디렉토리 삭제 실패: " + userId, e);
            throw new RuntimeException("사용자 디렉토리 삭제에 실패했습니다.");
        }
    }

    // 디렉토리 및 하위 파일/디렉토리 삭제
    private void deleteDirectory(Path path) throws IOException {
        if (Files.isDirectory(path)) {
            try (DirectoryStream<Path> entries = Files.newDirectoryStream(path)) {
                for (Path entry : entries) {
                    deleteDirectory(entry);
                }
            }
        }
        Files.delete(path);
    }

    // 유저 아이디로 검색
    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }


    // 사용자 비밀번호 재설정
    public UserResponse findByNewPw(String id, String password) {
        log.info("user id={}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));

        user.setPassword(bCryptPasswordEncoder.encode(password));
        return entityToResponse(userRepository.save(user));
    }

    // 사용자 비밀번호 변경
    public UserResponse updatePassword(String userId, String oldPassword, String newPassword) {
        log.info("user id={}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다"));
        if (bCryptPasswordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(bCryptPasswordEncoder.encode(newPassword));
            return entityToResponse(userRepository.save(user));
        } else {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다!!");
        }
    }

//    // 사용자 이메일로 유저 찾기(친구 검색)
//    public List<UserSearchResult> searchUsersByEmail(String email, String id) {
//        User currentUser = userRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));
//
//        List<User> userList = userRepository.findByEmailStartingWith(email);
//        if (userList.isEmpty()) {
//            throw new IllegalArgumentException("검색 결과가 없습니다.");
//        }
//
//        return userList.stream()
//                .filter(user -> !user.getId().equals(id))
//                .filter(user -> currentUser.getFriendshipList().stream()
//                        .noneMatch(friendship ->
//                                (friendship.getFriendEmail().equals(user.getEmail()) &&
//                                        (friendship.getStatus().equals(FriendshipStatus.ACCEPT) ||
//                                                friendship.getStatus().equals(FriendshipStatus.WAITING)))))
//                .map(user -> new UserSearchResult(user.getId(), user.getEmail(), user.getUserNick()))
//                .collect(Collectors.toList());
//    }

    // 사용자 이메일로 유저 찾기(친구 검색)에서 차단된 친구 필터링
    public List<UserSearchResult> searchUsersByEmail(String email, String userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));

        List<User> userList = userRepository.findByEmailStartingWith(email);
        if (userList.isEmpty()) {
            throw new IllegalArgumentException("검색 결과가 없습니다.");
        }

        List<String> blockedEmails = friendshipRepository.findByUsersAndStatus(currentUser, FriendshipStatus.BLOCKED)
                .stream()
                .map(Friendship::getFriendEmail)
                .collect(Collectors.toList());

        return userList.stream()
                .filter(user -> !user.getId().equals(userId))
                .filter(user -> !blockedEmails.contains(user.getEmail()))
                .filter(user -> currentUser.getFriendshipList().stream()
                        .noneMatch(friendship ->
                                (friendship.getFriendEmail().equals(user.getEmail()) &&
                                        (friendship.getStatus().equals(FriendshipStatus.ACCEPT) ||
                                                friendship.getStatus().equals(FriendshipStatus.WAITING)))))
                .map(user -> new UserSearchResult(user.getId(), user.getEmail(), user.getUserNick()))
                .collect(Collectors.toList());
    }

}