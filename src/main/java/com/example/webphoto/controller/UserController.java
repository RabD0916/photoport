package com.example.webphoto.controller;

import com.example.webphoto.dto.*;
import com.example.webphoto.service.TokenService;
import com.example.webphoto.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final TokenService tokenService;

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<AddUserResponse> AddUser(@RequestBody AddUserRequest dto) {
        AddUserResponse response = userService.addUser(dto);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response); // 성공한 응답
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); // 실패한 응답
        }
    }

    // 로그인
    @PostMapping("/signin")
    public ResponseEntity<CreateAccessTokenResponse> postSignin(
            @RequestBody CreateAccessTokenRequest request) {
        try {
            CreateAccessTokenResponse response = tokenService.createAccessToken(request);
            return ResponseEntity.ok(response);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(null);
        }
    }



    // ?? 이건 잘 모름
    @PostMapping("/token")
    public ResponseEntity<CreateAccessTokenResponse> postToken(
            @RequestBody CreateAccessTokenRequest request
    ){

        try {
            CreateAccessTokenResponse response = tokenService.createAccessToken(request);
            return ResponseEntity.ok(response);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(null);
        }
    }


    // 회원정보 수정
    @PostMapping("/update")
    public ResponseEntity<AddUserResponse> updateUser(Principal user, @RequestBody AddUserRequest dto) {
        AddUserResponse updateUser = userService.updateUser(user.getName(), dto);
        return ResponseEntity.ok(updateUser);
    }


    // 회원 삭제
    @PostMapping("/delete")
    public String deleteUser(Principal user) {
        userService.deleteUser(user.getName());
        return "회원 탈퇴";
    }
}
