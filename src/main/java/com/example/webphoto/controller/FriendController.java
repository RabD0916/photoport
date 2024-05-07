package com.example.webphoto.controller;

import com.example.webphoto.domain.User;
import com.example.webphoto.dto.*;
import com.example.webphoto.service.FriendshipService;
import com.example.webphoto.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FriendController {

    private final UserService userService;
    private final FriendshipService friendshipService;

    // 친구 요청
    @PostMapping("/user/friends/{email}")
    public ResponseEntity<FriendshipRequestResponse> sendFriendshipRequest(@PathVariable("email") String email, Principal user) throws Exception {
        FriendshipRequestResponse response = friendshipService.createFriendship(email, user);
        return ResponseEntity.ok(response);
    }

    // 받은 요청 목록들
    @GetMapping("/user/friends/received")
    public ResponseEntity<WaitingFriendListResponse> getWaitingFriendInfo(Principal user) throws Exception {
        User users = userService.findById(user.getName());
        String email = users.getEmail();
        WaitingFriendListResponse response = friendshipService.getWaitingFriendList(email);
        return ResponseEntity.ok(response);
    }

    // 친구 요청 수락
    @PostMapping("/user/friends/approve/{friendshipId}")
    public ResponseEntity<FriendshipApprovalResponse> approveFriendship(@PathVariable("friendshipId") Long friendshipId) throws Exception {
        FriendshipApprovalResponse response = friendshipService.approveFriendshipRequest(friendshipId);
        return ResponseEntity.ok(response);
    }

    // 친구 요청 거절
    @DeleteMapping("/user/friends/reject/{friendshipId}")
    public ResponseEntity<FriendshipRejectionResponse> rejectFriendship(@PathVariable("friendshipId") Long friendshipId) throws Exception {
        FriendshipRejectionResponse response = friendshipService.rejectFriendshipRequest(friendshipId);
        return ResponseEntity.ok(response);
    }

    // 친구 목록
    @GetMapping("/user/friendsList")
    public ResponseEntity<List<FriendDTO>> getFriendList(Principal user) throws Exception {
        User users = userService.findById(user.getName());
        String userEmail = users.getEmail();
        List<FriendDTO> response = friendshipService.findFriendsByUserEmail(userEmail);
        return ResponseEntity.ok(response);
    }

    // 친구 요청 삭제
    @DeleteMapping("/user/friends/remove/{friendshipId}")
    public ResponseEntity<FriendshipRemovalResponse> removeFriend(@PathVariable("friendshipId") Long friendshipId) throws Exception {
        FriendshipRemovalResponse response = friendshipService.removeFriendship(friendshipId);
        return ResponseEntity.ok(response);
    }
}