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
public class AddBoardRequest {

    private String title;
    private String content;
    private String fileName;
    private BoardShare share;
    private BoardType type;
    private String username;

    public AddBoardRequest(String title, String content, String file) {
        this.title = title;
        this.content = content;
        this.fileName = file;
    }
}
