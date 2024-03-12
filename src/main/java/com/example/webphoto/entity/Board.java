package com.example.webphoto.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Board {
    @Id
    @GeneratedValue
    private Long id;
    @Column
    private String title;
    @Column
    private String tag;
    @Column
    private String content;

    @Column
    private String picture;

    public Board(Long id, String title, String tag, String content, String picture) {
        this.id = id;
        this.title = title;
        this.tag = tag;
        this.content = content;
        this.picture = picture;
    }

    @Override
    public String toString() {
        return "Board{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", tag='" + tag + '\'' +
                ", content='" + content + '\'' +
                ", picture='" + picture + '\'' +
                '}';
    }
}
