package com.example.webphoto.dto;

import com.example.webphoto.domain.enums.BoardType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardPreviewResponse {
    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private int view;
    private int like;
    private int bookmark;
    private String writerId;
    private String writerName;
    private MediaResponse media;
    private List<String> tags;
}
