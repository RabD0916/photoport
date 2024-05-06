package com.example.webphoto.repository;

import com.example.webphoto.domain.BoardTag;
import com.example.webphoto.domain.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    public Boolean existsByName(String name);
}
