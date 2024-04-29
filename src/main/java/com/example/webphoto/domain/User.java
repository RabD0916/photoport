package com.example.webphoto.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="user_")
public class User {

    @Id
    @Column(name = "user_id", length = 100)
    private String id;

    @Column(name = "user_pw", length = 100, nullable = false)
    private String password;

    @Column(name = "user_nick", length = 100, nullable = false)
    private String userNick;

    @Column(name = "user_phone", length = 100, nullable = false)
    private String phone;

    @Column(name = "user_birth", length = 100, nullable = false)
    private String birth;

    @Column(name = "user_email", length = 100, nullable = false)
    private String email;

    @CreationTimestamp
    @Column(name = "user_conn", length = 100)
    private LocalDateTime userConn;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "user_type")
    private UserType userType;

    @Column(name = "user_agree")
    private boolean userAgree; // 알림 수신 여부

    @OneToMany(mappedBy = "owner")
    private List<Media> medias = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<LookedBoard> lookedBoards = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<LikedBoard> likedBoards = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<BookmarkedBoard> bookmarkedBoards = new ArrayList<>();

    @OneToMany(mappedBy = "writer")
    private List<Board> boards = new ArrayList<>();

    @OneToMany(mappedBy = "writer")
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "followed")
    private List<Follow> followingUsers = new ArrayList<>();

    @OneToMany(mappedBy = "follower")
    private List<Follow> followerUsers = new ArrayList<>();

    @OneToMany(mappedBy = "receiver")
    private List<Alarm> receiveAlarms = new ArrayList<>();

    @OneToMany(mappedBy = "sender")
    private List<Alarm> sendAlarms = new ArrayList<>();

    public User(String id, String password, String userNick, String phone, String birth, String email, LocalDateTime userConn, UserType userType, boolean userAgree) {
        this.id = id;
        this.password = password;
        this.userNick = userNick;
        this.phone = phone;
        this.birth = birth;
        this.email = email;
        this.userConn = userConn;
        this.userType = userType;
        this.userAgree = userAgree;
    }
}
