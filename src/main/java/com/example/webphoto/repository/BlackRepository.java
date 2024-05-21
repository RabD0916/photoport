package com.example.webphoto.repository;

import com.example.webphoto.domain.Black;
import com.example.webphoto.domain.enums.BlackType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlackRepository extends JpaRepository<Black, Long> {
    List<Black> findByBlackType(BlackType blackType);
}
