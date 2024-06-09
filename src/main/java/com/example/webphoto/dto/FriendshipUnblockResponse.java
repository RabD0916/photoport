package com.example.webphoto.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipUnblockResponse {
    private Long friendshipId;
    private String message;
}
