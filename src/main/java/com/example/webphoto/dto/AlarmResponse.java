package com.example.webphoto.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class AlarmResponse {
    private Long id;
    private String content;
    private LocalDateTime date;
    private Long boardId;
    private String boardTitle;
}