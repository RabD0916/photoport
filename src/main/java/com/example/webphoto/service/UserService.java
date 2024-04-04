package com.example.webphoto.service;

import com.example.webphoto.domain.User;
import com.example.webphoto.domain.UserType;
import com.example.webphoto.dto.AddUserRequest;
import com.example.webphoto.dto.AddUserResponse;
import com.example.webphoto.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
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
        String password = bCryptPasswordEncoder.encode(dto.getPassword());
        if (dto.getId().equals("ADMIN")) {
            return new User(dto.getId(), password, dto.getUserNick(),
                    dto.getPhone(),  dto.getBirth(), dto.getEmail(), dto.getUserConn(), UserType.ADMIN, true);
        } else {
            return new User(dto.getId(), password, dto.getUserNick(),
                    dto.getPhone(),  dto.getBirth(), dto.getEmail(), dto.getUserConn(), UserType.USER, true);
        }
    }

    // user 엔티티를 AddUserResponse Dto로 변환
    private AddUserResponse entityToResponse(User user) {
        return new AddUserResponse(user.getId(), "ok",  true, "성공적으로 처리하였습니다.");
    }


    // 사용자를 추가하는 메소드
    public AddUserResponse addUser(AddUserRequest dto) {
        User user = userRepository.save(requestToEntity(dto));
        return entityToResponse(user);
    }

    // 사용자 정보를 수정하는 메소드
    public AddUserResponse updateUser(String username, AddUserRequest dto) {
        Optional<User> res = userRepository.findById(username);
        if (!res.isPresent()) {
            throw new EntityNotFoundException("회원정보가 없습니다.");
        }

        User user = res.get();
        user.setUserNick(dto.getUserNick());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        User newUser = userRepository.save(user);
        return entityToResponse(newUser);
    }

    // 사용자를 삭제하는 메소드
    public void deleteUser(String username) {
        userRepository.deleteById(username);
    }

    // 유저 아이디로 검색
    public User findById(String username) {
        System.out.println("유저 이름 :");
        System.out.println(username);
        Optional<User> res = userRepository.findById(username);
        if (res.isPresent()) return res.get();
        return null;
    }
}
