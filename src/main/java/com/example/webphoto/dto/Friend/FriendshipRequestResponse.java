package com.example.webphoto.dto.Friend;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FriendshipRequestResponse {
    private String userEmail;
    private String friendEmail;
    private String message;
}
