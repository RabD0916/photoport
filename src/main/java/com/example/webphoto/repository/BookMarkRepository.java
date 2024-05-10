package com.example.webphoto.repository;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.BookmarkedBoard;
import com.example.webphoto.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookMarkRepository extends JpaRepository<BookmarkedBoard, Long> {

    // 사용자와 게시판에 해당하는 북마크가 있는지 검사
    boolean existsByUserAndBoard(User user, Board board);

    // 사용자와 게시판에 해당하는 북마크 삭제
    void deleteByUserAndBoard(User user, Board board);
}
