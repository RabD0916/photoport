package com.example.webphoto.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipBlockResponse {
    private Long friendshipId;
    private String message;
}
