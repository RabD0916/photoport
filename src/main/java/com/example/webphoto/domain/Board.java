package com.example.webphoto.domain;

import com.example.webphoto.domain.enums.BoardShare;
import com.example.webphoto.domain.enums.BoardType;
import jakarta.persistence.*;
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
@Table(name = "board_")
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

    @Column(name="board_bookmark", length = 100)
    private int bookmark;

    @Enumerated(value = EnumType.STRING)
    @Column(name="board_share")
    private BoardShare share;

    @Enumerated(value = EnumType.STRING)
    @Column(name="board_type")
    private BoardType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id")
    private User writer;

    @OneToMany(mappedBy = "board")
    private List<MediaBoard> medias = new ArrayList<>();

    @OneToMany(mappedBy = "board")
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "board")
    private List<BoardTag> tags = new ArrayList<>();

    @OneToMany(mappedBy = "board")
    private List<LookedBoard> lookedBoards = new ArrayList<>();

    @OneToMany(mappedBy = "board")
    private List<LikedBoard> likedBoards = new ArrayList<>();

    @OneToMany(mappedBy = "board")
    private List<BookmarkedBoard> bookmarkedBoards = new ArrayList<>();

    public Board(Long id, String title, LocalDateTime createdAt, String content, int view, int like, int bookmark, BoardShare share, BoardType type, User writer) {
        this.id = id;
        this.title = title;
        this.createdAt = createdAt;
        this.content = content;
        this.view = view;
        this.like = like;
        this.bookmark = bookmark;
        this.share = share;
        this.type = type;
        this.writer = writer;
    }
}