package com.example.webphoto.repository;

import com.example.webphoto.domain.Media;
import com.example.webphoto.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MediaRepository extends JpaRepository<Media, Long> {
    Optional<Media> findByOwner(User owner);
    Optional<Media> findByCategory(String category);
}
