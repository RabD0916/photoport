package com.example.webphoto.service;

import com.example.webphoto.dto.KakaoUserInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class KakaoApiService {

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.client-secret}")
    private String clientSecret;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    private final RestTemplate restTemplate;

    public String getKakaoAccessToken(String code) {
        String url = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);
        if (clientSecret != null) {
            params.add("client_secret", clientSecret);
        }

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.POST, request, new ParameterizedTypeReference<Map<String, Object>>() {});

        return (String) response.getBody().get("access_token");
    }

    public KakaoUserInfo getKakaoUserInfo(String accessToken) {
        String url = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.GET, request, new ParameterizedTypeReference<Map<String, Object>>() {});

        Map<String, Object> body = response.getBody();
        Map<String, Object> kakaoAccount = (Map<String, Object>) body.get("kakao_account");

        String email = (String) kakaoAccount.get("email");
        String nickname = (String) ((Map<String, Object>) body.get("properties")).get("nickname");
        String name = (String) kakaoAccount.get("name");
        String birthday = "0" + kakaoAccount.get("birthday");
        String phoneNumber = (String) kakaoAccount.get("phone_number");

        return new KakaoUserInfo(email, nickname, name, birthday, phoneNumber);
    }
}