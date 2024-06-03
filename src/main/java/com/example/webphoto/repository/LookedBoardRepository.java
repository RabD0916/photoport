package com.example.webphoto.repository;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.LookedBoard;
import com.example.webphoto.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LookedBoardRepository extends JpaRepository<LookedBoard, Long> {
    List<LookedBoard> findByUser(User user);
    // 이미 본 게시글 테이블에 등록된 게시글인가 체크
    Optional<LookedBoard> findByUserAndBoard(User user, Board board);
}
