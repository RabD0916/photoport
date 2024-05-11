package com.example.webphoto.dto.Friend;

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
