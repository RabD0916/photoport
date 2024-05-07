package com.example.webphoto.dto;

import com.example.webphoto.domain.Comment;
import com.example.webphoto.domain.Media;
import com.example.webphoto.domain.Tag;
import com.example.webphoto.domain.enums.BoardShare;
import com.example.webphoto.domain.enums.BoardType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetBoardResponse {

    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private String content;
    private int view;
    private int like;
    private int bookmark;
    private BoardShare share;
    private BoardType type;
    private String writer;
//    private List<GetMedia> media;
//    private List<GetComment> comments;
//    private List<String> tags;
    private List<GetMedia> media;
    private List<Comment> comments;
    private List<String> tags;
}
