package com.example.webphoto.repository;

import com.example.webphoto.domain.Media;
import com.example.webphoto.domain.MediaBoard;
import com.example.webphoto.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByOwner(User owner);
    List<Media> findByOwnerAndCategory(User owner, String category);
    Media findByOwnerAndCategoryAndName(User owner, String category, String name);
}
