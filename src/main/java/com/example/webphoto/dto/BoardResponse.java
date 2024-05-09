package com.example.webphoto.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardResponse {
    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private String content;
    private int view;
    private int like;
    private int bookmark;
    private String writerId;
    private String writerName;
    private List<GetMedia> media;
    private CommentDtos dtos; // dto로 반환하는 걸로 수정했음(성공 response에 성공적으로 해당 게시글에 등록된 모든 댓글 불러올 수 있음)
    private List<String> tags;
}
