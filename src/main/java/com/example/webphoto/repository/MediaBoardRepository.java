package com.example.webphoto.repository;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.Media;
import com.example.webphoto.domain.MediaBoard;
import com.example.webphoto.repository.records.MediaRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MediaBoardRepository extends JpaRepository<MediaBoard, Long> {
    public List<MediaBoard> findByMedia(Media media);
    public List<MediaBoard> findByBoard(Board board);
}

