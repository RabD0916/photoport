package com.example.webphoto.dto;

import com.example.webphoto.domain.BoardTag;
import com.example.webphoto.domain.MediaBoard;
import com.example.webphoto.domain.User;
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
public class AddBoardRequest {
    private String title;
    private String content;
    private String[] categories;
    private String[] mediaNames;
    private String tags;
    private BoardShare share;
    private BoardType type;
    private String writerId;
}
