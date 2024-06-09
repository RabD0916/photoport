package com.example.webphoto.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@ToString
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long friendshipId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User users;

    private String userEmail;
    private String friendEmail;

    private FriendshipStatus status;

    private boolean isFrom;

    private Long counterpartId;


    public void acceptFriendshipRequest() {
        status = FriendshipStatus.ACCEPT;
    }


    public void setCounterpartId(Long id) {
        counterpartId = id;
    }
}