package com.example.webphoto.repository;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.Comment;
import com.example.webphoto.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    public List<Comment> findByBoard(Board board);

    public List<Comment> findByBoardId(Long boardId);

    public List<Comment> findByWriterId(String userId);
}