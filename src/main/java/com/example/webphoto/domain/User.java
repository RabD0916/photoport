package com.example.webphoto.domain;

import com.example.webphoto.domain.enums.UserType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="user_")
public class User {

    @Id
    @Column(name = "user_id", length = 100)
    private String id;

    @Column(name = "user_pw", length = 100)
    private String password;

    @Column(name = "user_nick", length = 100)
    private String userNick;

    @Column(name = "user_phone", length = 100)
    private String phone;

    @Column(name = "user_birth", length = 100)
    private String birth;

    @Column(name = "user_email", length = 100)
    private String email;

    @CreationTimestamp
    @Column(name = "user_conn", length = 100)
    private LocalDateTime userConn;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "user_type")
    private UserType userType;

    @Column(name = "user_agree")
    private boolean userAgree; // 알림 수신 여부

    @Column(name = "profile")
    private String userProfile;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Media> medias = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LookedBoard> lookedBoards = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LikedBoard> likedBoards = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookmarkedBoard> bookmarkedBoards = new ArrayList<>();

    @OneToMany(mappedBy = "writer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Board> boards = new ArrayList<>();

    @OneToMany(mappedBy = "writer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Friendship> friendshipList = new ArrayList<>();
}
