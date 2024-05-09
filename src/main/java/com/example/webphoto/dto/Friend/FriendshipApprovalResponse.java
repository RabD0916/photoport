package com.example.webphoto.dto.Friend;

import com.example.webphoto.domain.FriendshipStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendshipApprovalResponse {
    private Long friendshipId;
    private String friendName;
    private FriendshipStatus status;
    private String message; // 요청 승인 메시지
}
