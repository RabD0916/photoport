package com.example.webphoto.service;

import com.example.webphoto.domain.User;
import com.example.webphoto.domain.enums.UserType;
import com.example.webphoto.dto.AccessTokenResponse;
import com.example.webphoto.dto.KakaoUserInfo;
import com.example.webphoto.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SocialLoginService {

    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final KakaoApiService kakaoApiService; // 카카오 API 호출을 위한 서비스 (가정)

    public String getKakaoAccessToken(String code) {
        return kakaoApiService.getKakaoAccessToken(code); // 카카오 API로부터 액세스 토큰 요청 로직
    }

    public KakaoUserInfo getKakaoUserInfo(String accessToken) {
        return kakaoApiService.getKakaoUserInfo(accessToken); // 카카오 API로부터 사용자 정보 요청 로직
    }

    @Transactional
    public AccessTokenResponse processKakaoUser(KakaoUserInfo userInfo) {
        Optional<User> userOptional = userRepository.findByEmail(userInfo.getEmail());

        if (userOptional.isPresent()) {
            // 기존 사용자: JWT 토큰 생성 후 반환
            User user = userOptional.get();
            return tokenService.createTokensForUser(user);
        } else {
            User newUser = new User();
            newUser.setId(userInfo.getEmail());
            newUser.setPassword(generateUniqueId()); // 비밀번호 자동 생성
            newUser.setUserNick(userInfo.getNickname());
            newUser.setPhone(userInfo.getPhoneNumber());
            newUser.setBirth("0" + userInfo.getBirthday());
            newUser.setEmail(userInfo.getEmail());
            newUser.setUserConn(LocalDateTime.now()); // 현재 시간
            newUser.setUserType(UserType.USER); // 기본값 설정
            newUser.setUserAgree(true); // 기본값
            newUser.setUserProfile("/images/profile.png");
            userRepository.save(newUser);
            return tokenService.createTokensForUser(newUser);
        }
    }

    private String generateUniqueId() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}