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
@Table(name = "board_")
@AllArgsConstructor
@NoArgsConstructor
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="board_id")
    private Long id;

    @Column(name="board_title", length = 100)
    private String title;

    @CreationTimestamp
    @Column(name="board_createAt", length = 100)
    private LocalDateTime createdAt;

    @Column(name="board_content", length = 100)
    private String content;

    @Column(name="board_view", length = 100)
    private int view;

    @Column(name="board_like", length = 100)
    private int like;

    @Column(name="board_status", length = 100)
    private int stat;

    @Column(name="board_type", length = 100)
    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id")
    private User writer;

}