package com.example.webphoto;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@RestController
public class CategoryController {
    @GetMapping("/sendCategory/{userId}")
    public String[] send(@PathVariable String userId) {
        String dir = "./front4/public/images/" + userId;
        File folder = new File(dir);
        String[] fileNames;
        fileNames = folder.list();

        if(fileNames == null) {
            fileNames = new String[1];
            fileNames[0] = "Folder Not Found";
        }
        return fileNames;
    }
}
