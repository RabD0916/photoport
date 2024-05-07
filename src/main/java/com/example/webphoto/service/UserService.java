package com.example.webphoto.service;

import com.example.webphoto.domain.Friendship;
import com.example.webphoto.domain.FriendshipStatus;
import com.example.webphoto.domain.User;
import com.example.webphoto.domain.enums.UserType;
import com.example.webphoto.dto.AddUserRequest;
import com.example.webphoto.dto.AddUserResponse;
import com.example.webphoto.dto.UserSearchResult;
import com.example.webphoto.repository.FriendshipRepository;
import com.example.webphoto.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.webjars.NotFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public User findByUserNick(String userNick) {
        return userRepository.findByUserNick(userNick)
                .orElseThrow(() -> new NotFoundException("User not found with usreNick" + userNick));
    }

    // 이메일을 이용하여 사용자의 아이디를 찾는 메소드
    public String findUserIdByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User res = user.get();
            return res.getId();
        } else {
            return null;
        }
    }


    // dto를 user엔티티로 저장
    private User requestToEntity(AddUserRequest dto) {
        Optional<User> existingUser = userRepository.findById(dto.getId());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 사용자 ID입니다.");
        }
        String password = bCryptPasswordEncoder.encode(dto.getPassword());
        if (dto.getId().equals("ADMIN")) {
            return new User(dto.getId(), password, dto.getUserNick(),
                    dto.getPhone(), dto.getBirth(), dto.getEmail(), LocalDateTime.now(), UserType.ADMIN, true, "/images/profile.png");
        } else {
            return new User(dto.getId(), password, dto.getUserNick(),
                    dto.getPhone(), dto.getBirth(), dto.getEmail(), LocalDateTime.now(), UserType.USER, true, "/images/profile.png");
        }
    }

    // user 엔티티를 AddUserResponse Dto로 변환
    private AddUserResponse entityToResponse(User user) {
        return new AddUserResponse(user.getId(), "ok", true, "성공적으로 처리하였습니다.", user.getUserProfile(), user.getUserNick());
    }


    // 사용자를 추가하는 메소드
    public AddUserResponse addUser(AddUserRequest dto) {
        User user = userRepository.save(requestToEntity(dto));
        return entityToResponse(user);
    }


    // 사용자 프로필을 수정하는 메소드
    public AddUserResponse updateUserProfile(String userId, String fileURL) {
        Optional<User> res = userRepository.findById(userId);
        if (!res.isPresent()) {
            throw new EntityNotFoundException("해당 프로필이 없습니다.");
        }

        User user = res.get();
        user.setUserProfile(fileURL);
        User newUser = userRepository.save(user);
        return entityToResponse(newUser);
    }

    // 사용자를 삭제하는 메소드
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    // 유저 아이디로 검색
    public User findById(String id) {
        System.out.println("유저 이름 :");
        System.out.println(id);
        Optional<User> res = userRepository.findById(id);
        if (res.isPresent()) return res.get();
        return null;
    }

    // 사용자 비밀번호 재설정
    public AddUserResponse findByNewPw(String id, String password) {
        log.info("user id={}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을수 없습니다."));

        String newPassword = bCryptPasswordEncoder.encode(password);
        user.setPassword(newPassword);
        User newUser = userRepository.save(user);
        return entityToResponse(newUser);
    }

    // 사용자 이메일로 유저 찾기(친구 검색)
    public List<UserSearchResult> searchUsersByEmail(String email, String id) throws Exception {
        // 현재 사용자 불러움
        User currentUser = userRepository.findById(id).orElse(null);

        // 현재 사용자의 친구 관계 및 친구 요청 목록을 가져옴
        List<Friendship> friendshipList = currentUser.getFriendshipList();

        // 이메일로 모든 유저 검색
        List<User> userList = userRepository.findByEmailStartingWith(email);
        if (userList.isEmpty()) {
            throw new Exception("검색 결과가 없습니다.");
        }

        // 필터링: 자기 자신, 이미 친구이거나 친구 요청을 보낸 유저 제외
        List<UserSearchResult> resultDtoList = userList.stream()
                .filter(user -> !user.getId().equals(id)) // 자기 자신 제외
                .filter(user -> friendshipList.stream()
                        .noneMatch(friendship ->
                                (friendship.getFriendEmail().equals(user.getEmail()) &&
                                        (friendship.getStatus().equals(FriendshipStatus.ACCEPT) ||
                                                friendship.getStatus().equals(FriendshipStatus.WAITING))))
                ) // 이미 친구이거나 친구 요청을 보낸 유저 제외
                .map(user -> {
                    UserSearchResult dto = new UserSearchResult();
                    dto.setUserId(user.getId());
                    dto.setUserEmail(user.getEmail());
                    dto.setUserNick(user.getUserNick());
                    return dto;
                }).collect(Collectors.toList());

        return resultDtoList;

    }
}
