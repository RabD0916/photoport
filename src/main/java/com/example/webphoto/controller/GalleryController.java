package com.example.webphoto.controller;

import com.example.webphoto.dto.Category;
import com.example.webphoto.dto.GetMedia;
import com.example.webphoto.service.CategoryService;
import com.example.webphoto.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GalleryController {
    private final CategoryService categoryService = new CategoryService();
    private final MediaService mediaService;
    private String nowUser = "";
    private String nowCate = "";

    @GetMapping("/sendCategory/{userId}")
    public List<Category> sendCategory(@PathVariable String userId) {
        this.nowUser = userId;
        return categoryService.send(userId);
    }

    @GetMapping("/sendMedia/{cateName}")
    public List<GetMedia> sendMedia(@PathVariable String cateName) {
        List<GetMedia> getMediaList = mediaService.send(nowUser, cateName);
        System.out.println(getMediaList);
        if(!getMediaList.isEmpty()) {
            nowCate = cateName;
        }
        return getMediaList;
    }

    @PostMapping("/createCategory/{cateName}")
    public String createCategory(@PathVariable String cateName) {
        return categoryService.create(nowUser, cateName);
    }

    @DeleteMapping("/deleteCategory/{cateName}")
    public String deleteCategory(@PathVariable String cateName) {
        return categoryService.delete(nowUser, cateName);
    }

    @DeleteMapping("/forceDeleteCategory/{cateName}")
    public String forceDeleteCategory(@PathVariable String cateName) {
        return categoryService.forceDelete(nowUser, cateName);
    }

    @PatchMapping("/moveMedia/{selectedMedia}/{nextCateName}")
    public String moveMedia(@PathVariable String selectedMedia, @PathVariable String nextCateName) {
        return mediaService.move(nowUser, nowCate, selectedMedia, nextCateName);
    }

    @DeleteMapping("/deleteMedia/{selectedMedia}")
    public String deleteMedia(@PathVariable String selectedMedia) {
        return mediaService.delete(nowUser, nowCate, selectedMedia);
    }
}
