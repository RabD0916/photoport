package com.example.webphoto.controller;

import com.example.webphoto.dto.AccessTokenRequest;
import com.example.webphoto.dto.AccessTokenResponse;
import com.example.webphoto.dto.KakaoUserInfo;
import com.example.webphoto.service.SocialLoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SocialLoginController {

    private final SocialLoginService socialLoginService;

    @PostMapping("/kakao/login")
    public ResponseEntity<AccessTokenResponse> kakaoLogin(@RequestBody AccessTokenRequest request) {
        String accessToken = socialLoginService.getKakaoAccessToken(request.getCode());
        KakaoUserInfo userInfo = socialLoginService.getKakaoUserInfo(accessToken);
        AccessTokenResponse response = socialLoginService.processKakaoUser(userInfo);
        return ResponseEntity.ok(response);
    }
}