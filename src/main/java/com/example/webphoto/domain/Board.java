package com.example.webphoto.domain;

import com.example.webphoto.domain.enums.BoardShare;
import com.example.webphoto.domain.enums.BoardType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
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
    private int view = 0;

    @Column(name="board_like", length = 100)
    private int like = 0;

    @Column(name="board_bookmark", length = 100)
    private int bookmark = 0;

    @Enumerated(value = EnumType.STRING)
    @Column(name="board_share")
    private BoardShare share;

    @Enumerated(value = EnumType.STRING)
    @Column(name="board_type")
    private BoardType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id")
    private User writer;

    @JsonIgnore
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MediaBoard> media = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardTag> tags = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LookedBoard> lookedBoards = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LikedBoard> likedBoards = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookmarkedBoard> bookmarkedBoards = new ArrayList<>();

    @Builder
    public Board(Long id, String title, LocalDateTime createdAt, String content, List<MediaBoard> media, List<BoardTag> tags, int view, int like, int bookmark, BoardShare share, BoardType type, User writer) {
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
        if (media != null) {
            setMedia(media);
        }
        if (tags != null) {
            setTags(tags);
        }
    }

    public void setTags(List<BoardTag> list) {
        this.tags.clear();
        for (BoardTag boardTag : list) {
            this.tags.add(boardTag);
            boardTag.setBoard(this);
        }
    }

    public void setMedia(List<MediaBoard> list) {
        this.media.clear();
        for (MediaBoard mediaBoard : list) {
            this.media.add(mediaBoard);
            mediaBoard.setBoard(this);
        }
    }
}