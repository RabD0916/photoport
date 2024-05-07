package com.example.webphoto.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "media_")
@AllArgsConstructor
@NoArgsConstructor
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="media_id")
    private Long id;

    @Column(name="media_name")
    private String name;

    @Column(name="media_date")
    private LocalDateTime date;

    @Column(name="media_cate_name")
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User owner;

    @JsonIgnore
    @OneToMany(mappedBy = "media")
    private List<MediaBoard> boards = new ArrayList<>();

    public Media(Long id, String name, LocalDateTime date, String category, User owner) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.category = category;
        this.owner = owner;
    }
}
