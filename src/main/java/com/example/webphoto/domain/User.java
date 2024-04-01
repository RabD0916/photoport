package com.example.webphoto.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="users")
public class User {

    @Id
    @Column(length = 100)
    private String username;

    @Column(length = 100, nullable = false)
    private String password;

    @Column(length = 100, nullable = false)
    private String userNick;

    @Column(length = 100, nullable = false)
    private String phone;

    @Column(length = 100, nullable = false)
    private String birth;

    @Column(length = 100, nullable = false)
    private String email;

    @CreationTimestamp
    @Column(length = 100)
    private LocalDateTime userConn;

    @Enumerated(value = EnumType.STRING)
    private UserType userType;

    @Column
    private boolean userAgree; // 알림 수신 여부

}
