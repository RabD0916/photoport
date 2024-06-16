package com.example.webphoto.controller;

import com.example.webphoto.dto.CloseFriendRequest;
import com.example.webphoto.dto.CloseFriendResponse;
import com.example.webphoto.service.CloseFriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/close-friends")
public class CloseFriendController {

    private final CloseFriendService closeFriendService;

    // 친한친구 추가
    @PostMapping("/add")
    public ResponseEntity<CloseFriendResponse> addCloseFriend(@RequestBody CloseFriendRequest request) {
        CloseFriendResponse response = closeFriendService.addCloseFriend(request);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(response);
    }

    // 친한 친구 리스트
    @GetMapping("/{userId}")
    public ResponseEntity<List<CloseFriendResponse>> getCloseFriends(@PathVariable String userId) {
        List<CloseFriendResponse> response = closeFriendService.getCloseFriends(userId);
        if (response == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(response);
    }

    // 친한 친구 삭제
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeCloseFriend(@RequestBody CloseFriendRequest request) {
        closeFriendService.removeCloseFriend(request);
        return ResponseEntity.ok().build();
    }
}