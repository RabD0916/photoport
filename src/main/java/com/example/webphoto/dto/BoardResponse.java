package com.example.webphoto.dto;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.enums.BoardType;
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
    private BoardType type;
    private String writerId;
    private String writerName;
    private List<MediaResponse> media;
    private CommentsResponse commentsDto; // dto로 반환하는 걸로 수정했음(성공 response에 성공적으로 해당 게시글에 등록된 모든 댓글 불러올 수 있음)
    private List<String> tags;

}
