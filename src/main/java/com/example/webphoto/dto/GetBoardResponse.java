package com.example.webphoto.dto;

import com.example.webphoto.domain.BoardShare;
import com.example.webphoto.domain.BoardType;
import lombok.*;

import java.time.LocalDateTime;

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
    private BoardShare share;
    private BoardType type;
    private String username;

}
