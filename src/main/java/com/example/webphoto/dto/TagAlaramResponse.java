package com.example.webphoto.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagAlaramResponse {
    private Long id;
    private String title;
    private String content;
    private String writerId;
    private String writerName;
    private List<MediaResponse> media;
    private List<String> tags;
    private int view;
    private int like;
    private int bookmark;
    private LocalDateTime createdAt;
}
