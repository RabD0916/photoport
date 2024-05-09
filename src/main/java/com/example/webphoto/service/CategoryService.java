package com.example.webphoto.service;

import com.example.webphoto.dto.Category;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class CategoryService {
    private final String path = "./front4/public/images/";

    public List<Category> send(String userId) {
        String dir = path + userId;
        String[] cateNames = getFileNames(dir);
        List<Category> categories = new ArrayList<>();

        if(cateNames != null) {
            for (int i=0; i<cateNames.length; i++) {
                String[] mediaNames;
                mediaNames = getFileNames(dir + "/" + cateNames[i]);
                if (mediaNames.length < 1) {
                    categories.add(new Category(cateNames[i], "Empty"));
                } else {
                    categories.add(new Category(cateNames[i], mediaNames[0]));
                }
            }
        }
        return categories;
    }

    public String create(String nowUser, String cateName) {
        String dir = path + nowUser + "/" + URLEncoder.encode(cateName, StandardCharsets.UTF_8).replaceAll("%", "&");
        File folder = new File(dir);
        String result;
        if(!folder.exists()) {
            result = folder.mkdir() ? "Success" : "Fail";
        } else {
            result = "Already Exist";
        }
        return result;
    }

    public String delete(String nowUser, String cateName) {
        return deleteFile(path + nowUser + "/" + URLEncoder.encode(cateName, StandardCharsets.UTF_8).replaceAll("%", "&"));
    }

    public String forceDelete(String nowUser, String cateName) {
        String dir = path + nowUser + "/" + URLEncoder.encode(cateName, StandardCharsets.UTF_8).replaceAll("%", "&");
        for(String mediaName : getFileNames(dir)) {
            String mediaDir = dir + "/" + mediaName;
            String result = deleteFile(mediaDir);
            if(!result.equals("Success")) {
                return result;
            }
        }
        return deleteFile(dir);
    }



    private String deleteFile(String dir) {
        File file = new File(dir);
        if (file.exists()) {
            return file.delete() ? "Success" : "Fail";
        } else {
            return "Not Exist";
        }
    }

    private String[] getFileNames(String dir) {
        File folder = new File(dir);
        return folder.list();
    }
}