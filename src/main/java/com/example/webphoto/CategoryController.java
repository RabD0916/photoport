package com.example.webphoto;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.Arrays;
import java.util.List;

@RestController
public class CategoryController {
    @GetMapping("/sendCategory/{userId}")
    public List<String> send(@PathVariable String userId) {
        String dir = "./images/" + userId;
        File folder = new File(dir);
        List<String> fileNames = Arrays.asList(folder.list());

        return fileNames;
    }
}
