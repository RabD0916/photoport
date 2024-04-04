package com.example.webphoto.service;

import com.example.webphoto.domain.RefreshToken;
import com.example.webphoto.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RefreshTokenService {

    private final RefreshTokenRepository repository;

    public RefreshToken findByRefreshToken(String refreshToken) {
        return repository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException());
    }
    public RefreshToken findByUserId(String userId) {
        return repository.findByUserId(userId)
                .orElseGet(() -> new RefreshToken(null, userId, null));
    }
    public RefreshToken save(RefreshToken refreshToken) {
        return repository.save(refreshToken);
    }
}
