package com.example.webphoto.controller;

import com.example.webphoto.dto.CloseFriendRequest;
import com.example.webphoto.dto.CloseFriendResponse;
import com.example.webphoto.service.CloseFriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/close-friends")
public class CloseFriendController {

    private final CloseFriendService closeFriendService;

    @PostMapping("/add")
    public ResponseEntity<CloseFriendResponse> addCloseFriend(@RequestBody CloseFriendRequest request) {
        CloseFriendResponse response = closeFriendService.addCloseFriend(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CloseFriendResponse>> getCloseFriends(@PathVariable String userId) {
        List<CloseFriendResponse> response = closeFriendService.getCloseFriends(userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeCloseFriend(@RequestBody CloseFriendRequest request) {
        closeFriendService.removeCloseFriend(request);
        return ResponseEntity.ok().build();
    }
}