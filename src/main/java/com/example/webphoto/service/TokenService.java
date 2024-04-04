package com.example.webphoto.service;

import com.example.webphoto.config.JwtProperties;
import com.example.webphoto.domain.RefreshToken;
import com.example.webphoto.domain.User;
import com.example.webphoto.dto.CreateAccessTokenRequest;
import com.example.webphoto.dto.CreateAccessTokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;

@RequiredArgsConstructor
@Service
public class TokenService {

    private final JWTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtProperties jwtProperties;

    public CreateAccessTokenResponse createAccessToken(CreateAccessTokenRequest request) {
        System.out.println(request.getId());
        System.out.println(request.getPassword());
        if(request.getId() != null && request.getPassword() != null) {

            User user = userService.findById(request.getId());
            if(bCryptPasswordEncoder.matches(request.getPassword(), user.getPassword())) {
                return new CreateAccessTokenResponse(
                        tokenProvider.createToken(user, Duration.ofMinutes(jwtProperties.getDuration())),
                        createRefreshToken(user));

            }
        }
        else if(request.getRefreshToken() != null) {
            if(tokenProvider.isValidToken(request.getRefreshToken())) {
                String userId = refreshTokenService.findByRefreshToken(request.getRefreshToken()).getUserId();
                User user = userService.findById(userId);
                return new CreateAccessTokenResponse(
                        tokenProvider.createToken(user, Duration.ofMinutes(jwtProperties.getDuration())),
                        null);
            }
        }
        throw new IllegalArgumentException("Invalid password");
    }

    public String createRefreshToken(User user) throws IllegalArgumentException{

        String token = tokenProvider.createToken(user, Duration.ofHours(jwtProperties.getRefreshDuration()));
        RefreshToken refreshToken = refreshTokenService.findByUserId(user.getId());
        refreshToken.setRefreshToken(token);
        refreshTokenService.save(refreshToken); // save refresh token
        return token;
    }

}
