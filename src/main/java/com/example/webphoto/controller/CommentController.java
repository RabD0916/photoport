package com.example.webphoto.controller;

import com.example.webphoto.domain.Comment;
import com.example.webphoto.domain.User;
import com.example.webphoto.dto.AddCommentRequest;
import com.example.webphoto.dto.AddCommentResponse;
import com.example.webphoto.dto.CommentDtos;
import com.example.webphoto.dto.DeleteCommentResponse;
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
    public AddCommentResponse addComment(@PathVariable Long boardId, @RequestBody AddCommentRequest request, Principal user) {
        User writer = userService.findById(user.getName());
        return commentService.addComment(boardId, request, writer);
    }

    // 본인 댓글 조회
    @GetMapping("/commentList")
    public CommentDtos getComments(Principal user) {
        CommentDtos dtos = commentService.findUserComments(user.getName());
        return dtos;
    }

    // 댓글 수정
    @PatchMapping("/updateComments/{commentId}")
    public AddCommentResponse updateComments(@PathVariable Long commentId, @RequestBody AddCommentRequest request, Principal user) {
        User writer = userService.findById(user.getName());
        AddCommentResponse response = commentService.updateComment(commentId, request, writer);
        return response;
    }

    // 댓글 삭제
    @DeleteMapping("/deleteComments/{commentId}")
    public DeleteCommentResponse deleteComment(@PathVariable Long commentId, Principal user) {
        User writer = userService.findById(user.getName());
        DeleteCommentResponse response = commentService.deleteComment(commentId, writer);
        return response;
    }
}
