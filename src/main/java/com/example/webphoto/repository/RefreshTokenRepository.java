package com.example.webphoto.repository;

import com.example.webphoto.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    public Optional<RefreshToken> findByRefreshToken(String refreshToken);
    public Optional<RefreshToken> findByUsername(String username);
}
