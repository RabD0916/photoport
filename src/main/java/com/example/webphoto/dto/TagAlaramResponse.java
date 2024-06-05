package com.example.webphoto.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TagAlaramResponse {
    private String title;
    private String content;
    private String writerId;
}
