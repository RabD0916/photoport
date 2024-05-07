package com.example.webphoto.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "tag_")
@AllArgsConstructor
@NoArgsConstructor
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="tag_id")
    private Long id;

    @Column(name="tag_name", length = 100)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "tag")
    private List<BoardTag> boards = new ArrayList<>();

    public Tag(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
