package com.example.webphoto.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendshipRemovalResponse {
    private Long friendshipId;
    private String message;
}
