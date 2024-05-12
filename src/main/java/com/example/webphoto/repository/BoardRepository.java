package com.example.webphoto.repository;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.User;
import com.example.webphoto.domain.enums.BoardType;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByWriter_IdOrderByCreatedAtDesc(String id);

    // 제목,내용,태그를 기반으로 검색하는 쿼리
//    @Query("SELECT b FROM Board b LEFT JOIN b.tags bt LEFT JOIN bt.tag t WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword% OR t.name LIKE %:keyword%")
//    List<Board> searchByTitleOrContentOrTag(String keyword);

    @Query("SELECT b FROM Board b JOIN b.tags bt WHERE bt.tag.name LIKE %:keyword%")
    List<Board> searchByTag(String keyword);

    @Query("SELECT b FROM Board b WHERE b.title LIKE %:titleKeyword%")
    List<Board> searchByTitle(String titleKeyword);


    // 게시글 종류 별 리스트
    List<Board> findByType(BoardType boardType, Sort sort);

}
