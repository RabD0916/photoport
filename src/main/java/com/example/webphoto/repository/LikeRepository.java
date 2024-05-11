package com.example.webphoto.repository;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.LikedBoard;
import com.example.webphoto.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeRepository extends JpaRepository<LikedBoard, Long> {

    // 있는지 검토
    boolean existsByUserAndBoard(User user, Board board);
    // 삭제
    void deleteByUserAndBoard(User user, Board board);

    // 내가 좋아요 한 게시글 찾기
    List<LikedBoard> findByUser(User user);
}
