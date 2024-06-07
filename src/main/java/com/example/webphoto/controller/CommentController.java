package com.example.webphoto.controller;

import com.example.webphoto.domain.User;
import com.example.webphoto.dto.CommentRequest;
import com.example.webphoto.dto.CommentResponse;
import com.example.webphoto.dto.CommentsResponse;
import com.example.webphoto.service.CommentService;
import com.example.webphoto.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;

    // 댓글 생성
    @PostMapping("/comments/{boardId}")
    public ResponseEntity<CommentResponse> addComment(@PathVariable Long boardId, @RequestBody CommentRequest request, Principal user) {
        try {
            User writer = userService.findById(user.getName());
            CommentResponse response = commentService.addComment(boardId, request, writer);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("댓글 생성 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 본인 댓글 조회
    @GetMapping("/commentList")
    public ResponseEntity<CommentsResponse> getComments(Principal user) {
        try {
            CommentsResponse dtos = commentService.findUserComments(user.getName());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            log.error("댓글 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 댓글 수정
    @PostMapping("/updateComments/{commentId}")
    public ResponseEntity<CommentResponse> updateComments(@PathVariable Long commentId, @RequestBody CommentRequest request, Principal user) {
        try {
            User writer = userService.findById(user.getName());
            CommentResponse response = commentService.updateComment(commentId, request, writer);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("댓글 수정 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    // 댓글 삭제
    @DeleteMapping("/deleteComments/{commentId}")
    public ResponseEntity<CommentResponse> deleteComment(@PathVariable Long commentId, Principal user) {
        try {
            User writer = userService.findById(user.getName());
            CommentResponse response = commentService.deleteComment(commentId, writer);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("댓글 삭제 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }
}
