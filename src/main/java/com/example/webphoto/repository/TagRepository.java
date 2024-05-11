package com.example.webphoto.repository;

import com.example.webphoto.domain.BoardTag;
import com.example.webphoto.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    public Boolean existsByName(String name);

    Optional<Tag> findByName(String tag);
}
