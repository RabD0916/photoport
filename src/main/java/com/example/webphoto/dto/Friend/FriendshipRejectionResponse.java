package com.example.webphoto.dto.Friend;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendshipRejectionResponse {
    private Long friendshipId;
    private String message; // 요청 거절 메시지
}
