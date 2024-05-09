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
    public ResponseEntity<UserResponse> AddUser(@RequestBody UserRequest dto) {
        UserResponse response = userService.addUser(dto);
        if (response != null) {
            return ResponseEntity.ok(response); // 성공한 응답
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); // 실패한 응답
        }
    }

    // 로그인
    @PostMapping("/signin")
    public ResponseEntity<AccessTokenResponse> postSignin(
            @RequestBody AccessTokenRequest request) {
        try {

            AccessTokenResponse response = tokenService.createAccessToken(request);
            return ResponseEntity.ok(response);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(null);
        }
    }


    // 토큰 재발급(리프레시 토큰을 이용해서 액세스 토큰 재발급)
    @PostMapping("/token")
    public ResponseEntity<AccessTokenResponse> postToken(
            @RequestBody AccessTokenRequest request
    ){

        try {
            AccessTokenResponse response = tokenService.createAccessToken(request);
            return ResponseEntity.ok(response);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    // 회원 아이디 조회(됨)
//    @PostMapping("/checkUserId")
//    public boolean selectUser(@RequestBody String userId) {
//        User user = userService.findById(userId);
//        if (user != null) {
//            return new ;
//        }
//        return null;
//    }


    // 회원 삭제
    @PostMapping("/delete")
    public String deleteUser(Principal user) {
        userService.deleteUser(user.getName());
        return "delete User";
    }

    // 마이페이지 회원 프로필 가져오기
    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserResponse> addProfile(@PathVariable String userId) {
        User user = userService.findById(userId);

        UserResponse response = new UserResponse(userId, user.getUserNick(), user.getUserProfile(), user.getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/profileUpdate/{userId}")
    public ResponseEntity<UserResponse> updateProfile(@PathVariable String userId, @RequestParam("file") MultipartFile file) {
        String dir = path + userId + "/profile";
        User user = userService.findById(userId);
        File folder = new File(dir);

        // 해당 디렉토리가 없다면 디렉토리를 생성
        if (!folder.exists()) {
            boolean created = folder.mkdirs(); // 폴더 생성
            if (!created) {
                return ResponseEntity.internalServerError().body(new UserResponse(userId, user.getUserNick(), null, user.getEmail()));
            }
            System.out.println("폴더 생성완료");
        } else {
            System.out.println("폴더가 이미 존재합니다.");
        }

        try {
            Path filePath = Paths.get(folder.getAbsolutePath() + "/" + file.getOriginalFilename());

            // 파일 저장
            byte[] bytes = file.getBytes();
            Files.write(filePath, bytes);

            // 사용자 프로필 이미지 경로 업데이트
            String fileURL = "/images/" + userId + "/profile/" + file.getOriginalFilename();
            userService.updateUserProfile(userId, fileURL);

            // 파일 이름을 포함한 DTO 반환
            return ResponseEntity.ok(new UserResponse(userId, user.getUserNick(), file.getOriginalFilename(), user.getEmail()));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new UserResponse(userId, user.getUserNick(), null, user.getEmail()));
        }
    }

    @GetMapping("/user/search")
    public ResponseEntity<List<UserResponse>> searchUsersByEmail(@RequestParam("email") String email, Principal user) {
        try {
            List<UserResponse> searchResults = userService.searchUsersByEmail(email, user.getName());
            return new ResponseEntity<>(searchResults, HttpStatus.OK);
        } catch (Exception e) {
            log.error("찾을 수 없는 유저 : {}", e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
