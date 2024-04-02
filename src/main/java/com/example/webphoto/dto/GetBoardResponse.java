package com.example.webphoto.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetBoardResponse {

    private Long id;
    private String title;
    private LocalDateTime createdAt;
    private String content;
    private String fileName;
    private String username;

}