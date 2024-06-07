package com.example.webphoto.controller;

import com.example.webphoto.domain.User;
import com.example.webphoto.dto.*;
import com.example.webphoto.service.TokenService;
import com.example.webphoto.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Slf4j
public class UserController {

    private final String path = "./front4/public/images/";
    private final UserService userService;
    private final TokenService tokenService;

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<UserResponse> addUser(@RequestBody UserRequest dto) {
        try {
            UserResponse response = userService.addUser(dto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("회원가입 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // 로그인
    @PostMapping("/signin")
    public ResponseEntity<AccessTokenResponse> postSignin(@RequestBody AccessTokenRequest request) {
        try {
            AccessTokenResponse response = tokenService.createAccessToken(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("로그인 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    // 토큰 재발급(리프레시 토큰을 이용해서 액세스 토큰 재발급)
    @PostMapping("/token")
    public ResponseEntity<AccessTokenResponse> postToken(@RequestBody AccessTokenRequest request) {
        try {
            AccessTokenResponse response = tokenService.createAccessToken(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("토큰 재발급 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    // 회원 아이디 조회
    @PostMapping("/checkUserId")
    public ResponseEntity<String> selectUser(@RequestBody UserRequest dto) {
        User user = userService.findById(dto.getId());
        if (user != null) {
            return ResponseEntity.ok(dto.getId());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    // 회원 삭제
    @PostMapping("/delete")
    public ResponseEntity<String> deleteUser(Principal user) {
        userService.deleteUser(user.getName());
        return ResponseEntity.ok("User deleted successfully");
    }

    // 마이페이지 회원 프로필 가져오기
    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserResponse> getProfile(@PathVariable String userId) {
        User user = userService.findById(userId);
        if (user != null) {
            UserResponse response = new UserResponse(userId, user.getUserNick(), user.getUserProfile(), user.getEmail());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 회원 닉네임 업데이트
    @PostMapping("/nickUpdate/{userId}")
    public ResponseEntity<UserResponse> updateNick(@PathVariable String userId, String userNick) {
        UserResponse response = userService.updateUserNick(userId, userNick);
        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 회원 비밀번호 수정
    @PostMapping("/passwordUpdate/{userId}")
    public ResponseEntity<UserResponse> updatePassword(@PathVariable String userId, String oldPassword, String newPassword) {
        UserResponse response = userService.updatePassword(userId, oldPassword, newPassword);
        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    // 회원 프로필 업데이트
    @PostMapping("/profileUpdate/{userId}")
    public ResponseEntity<UserResponse> updateProfile(@PathVariable String userId, @RequestParam("file") MultipartFile file) {
        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        try {
            String fileURL = saveProfileImage(userId, file);
            userService.updateUserProfile(userId, fileURL);
            return ResponseEntity.ok(new UserResponse(userId, user.getUserNick(), fileURL, user.getEmail()));
        } catch (IOException e) {
            log.error("프로필 업데이트 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new UserResponse(userId, user.getUserNick(), null, user.getEmail()));
        }
    }

    // 프로필 이미지 저장
    private String saveProfileImage(String userId, MultipartFile file) throws IOException {
        String dir = path + userId + "/profile";
        File folder = new File(dir);

        if (!folder.exists() && !folder.mkdirs()) {
            throw new IOException("Failed to create profile directory for user: " + userId);
        }

        // 기존 파일 삭제
        File[] files = folder.listFiles();
        if (files != null) {
            for (File f : files) {
                if (!f.delete()) {
                    log.warn("Failed to delete file: {}", f.getAbsolutePath());
                }
            }
        }

        Path filePath = Paths.get(folder.getAbsolutePath(), file.getOriginalFilename());
        Files.write(filePath, file.getBytes());

        return "/images/" + userId + "/profile/" + file.getOriginalFilename();
    }

    @GetMapping("/user/search")
    public ResponseEntity<List<UserSearchResult>> searchUsersByEmail(@RequestParam("email") String email, Principal user) {
        try {
            List<UserSearchResult> searchResults = userService.searchUsersByEmail(email, user.getName());
            return ResponseEntity.ok(searchResults);
        } catch (IllegalArgumentException e) {
            log.error("유저 검색 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            log.error("유저 검색 중 에러 발생: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}