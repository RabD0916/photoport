package com.example.webphoto.dto;

import com.example.webphoto.domain.enums.BoardShare;
import com.example.webphoto.domain.enums.BoardType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddBoardResponse {

    private String title;
    private String content;
    private BoardShare share;
    private BoardType type;

}
