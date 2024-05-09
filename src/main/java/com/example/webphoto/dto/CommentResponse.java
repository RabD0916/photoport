package com.example.webphoto.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id; // 댓글 아이디
    private String content; // 댓글 본문
    private String writerId; // 댓글 작성자
    private String writerName;
}
