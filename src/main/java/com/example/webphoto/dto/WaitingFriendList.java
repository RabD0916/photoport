package com.example.webphoto.dto;

import com.example.webphoto.domain.FriendshipStatus;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WaitingFriendList {
    private Long friendshipId;
    private String friendEmail;
    private String friendName;
    private FriendshipStatus status;
}
