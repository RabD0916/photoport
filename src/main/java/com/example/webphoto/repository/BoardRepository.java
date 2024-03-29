package com.example.webphoto.repository;

import com.example.webphoto.domain.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {

    public List<Board> findByUser_usernameOrderByCreatedAtDesc(String username);
}
