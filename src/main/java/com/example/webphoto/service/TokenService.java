package com.example.webphoto.service;

import com.example.webphoto.config.JwtProperties;
import com.example.webphoto.domain.RefreshToken;
import com.example.webphoto.domain.User;
import com.example.webphoto.dto.AccessTokenRequest;
import com.example.webphoto.dto.AccessTokenResponse;
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

    public AccessTokenResponse createAccessToken(AccessTokenRequest request) {

        System.out.println(request.getPassword());
        if(request.getId() != null && request.getPassword() != null) {

            User user = userService.findById(request.getId());
            if(bCryptPasswordEncoder.matches(request.getPassword(), user.getPassword())) {
                return new AccessTokenResponse(
                        tokenProvider.createToken(user, Duration.ofMinutes(jwtProperties.getDuration())),
                        createRefreshToken(user), user.getId(), user.getUserNick());
            }
        }
        else if(request.getRefreshToken() != null) {
            if(tokenProvider.isValidToken(request.getRefreshToken())) {
                String userId = refreshTokenService.findByRefreshToken(request.getRefreshToken()).getUserId();
                User user = userService.findById(userId);
                return new AccessTokenResponse(
                        tokenProvider.createToken(user, Duration.ofMinutes(jwtProperties.getDuration())),
                        null, user.getId(), user.getUserNick());
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

    public AccessTokenResponse createTokensForUser(User user) {
        String accessToken = tokenProvider.createToken(user, Duration.ofMinutes(jwtProperties.getDuration()));
        String refreshToken = createRefreshToken(user);
        return new AccessTokenResponse(accessToken, refreshToken, user.getId(),user.getUserNick());
    }

}
