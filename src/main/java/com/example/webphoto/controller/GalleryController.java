package com.example.webphoto.controller;

import com.example.webphoto.dto.CategoryResponse;
import com.example.webphoto.dto.MediaResponse;
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

    @PostMapping("/createMedia")
    public String createMedia(@RequestBody String mediaNames) {
        return mediaService.create(nowUser, nowCate, mediaNames);
    }

    @GetMapping("/sendCategory/{userId}")
    public List<CategoryResponse> sendCategory(@PathVariable String userId) {
        this.nowUser = userId;
        return categoryService.send(userId);
    }

    @GetMapping("/sendMedia/{cateName}")
    public List<MediaResponse> sendMedia(@PathVariable String cateName) {
        List<MediaResponse> mediaResponseList = mediaService.send(nowUser, cateName);
        System.out.println(mediaResponseList);
        if(!mediaResponseList.isEmpty()) {
            nowCate = cateName;
        }
        return mediaResponseList;
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
