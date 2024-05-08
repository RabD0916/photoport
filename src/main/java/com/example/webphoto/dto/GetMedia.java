package com.example.webphoto.dto;

import com.example.webphoto.domain.Media;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.GetMapping;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetMedia {
    private String mediaName;
    private String categoryName;

    public void set(Media media) {
        mediaName = media.getName();
        categoryName = media.getCategory();
    }
}
