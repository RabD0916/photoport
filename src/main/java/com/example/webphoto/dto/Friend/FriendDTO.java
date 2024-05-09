package com.example.webphoto.dto.Friend;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FriendDTO {
    private Long friendId;
    private Long friendshipId;
    private String friendEmail;
    private String friendName;
}
