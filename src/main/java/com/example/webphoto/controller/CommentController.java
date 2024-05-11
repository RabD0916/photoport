package com.example.webphoto.controller;

import com.example.webphoto.domain.User;
import com.example.webphoto.dto.CommentRequest;
import com.example.webphoto.dto.CommentResponse;
import com.example.webphoto.dto.CommentsResponse;
import com.example.webphoto.service.CommentService;
import com.example.webphoto.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;

    // 댓글 생성
    @PostMapping("/comments/{boardId}")
    public CommentResponse addComment(@PathVariable Long boardId, @RequestBody CommentRequest request, Principal user) {
        User writer = userService.findById(user.getName());
        return commentService.addComment(boardId, request, writer);
    }

    // 본인 댓글 조회
    @GetMapping("/commentList")
    public CommentsResponse getComments(Principal user) {
        CommentsResponse dtos = commentService.findUserComments(user.getName());
        return dtos;
    }

    // 댓글 수정
    @PatchMapping("/updateComments/{commentId}")
    public CommentResponse updateComments(@PathVariable Long commentId, @RequestBody CommentRequest request, Principal user) {
        User writer = userService.findById(user.getName());
        CommentResponse response = commentService.updateComment(commentId, request, writer);
        return response;
    }

    // 댓글 삭제
    @DeleteMapping("/deleteComments/{commentId}")
    public CommentResponse deleteComment(@PathVariable Long commentId, Principal user) {
        User writer = userService.findById(user.getName());
        CommentResponse response = commentService.deleteComment(commentId, writer);
        return response;
    }
}
