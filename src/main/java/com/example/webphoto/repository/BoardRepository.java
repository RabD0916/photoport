package com.example.webphoto.repository;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.User;
import com.example.webphoto.domain.enums.BoardType;
import com.example.webphoto.domain.enums.UserType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Collection;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByWriter_IdOrderByCreatedAtDesc(String id);

    @Query("SELECT b FROM Board b JOIN b.tags bt WHERE bt.tag.name LIKE %:keyword%")
    List<Board> searchByTag(String keyword);

    @Query("SELECT b FROM Board b WHERE b.title LIKE %:titleKeyword%")
    List<Board> searchByTitle(String titleKeyword);

    Page<Board> findByType(BoardType boardType, Pageable pageable);

    // 게시글 종류 별 리스트
    List<Board> findByType(BoardType boardType, Sort sort);

    @Query("SELECT b FROM Board b WHERE b.writer.userType = :writerType AND b.type = :boardType")
    List<Board> findByWriterTypeAndType(@Param("writerType") UserType writerType, @Param("boardType") BoardType boardType);

    List<Board> findByType(BoardType boardType);
}
