package com.example.webphoto.dto;

import com.example.webphoto.domain.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class CommentDtos {
    private List<AddCommentResponse> comments;

    public CommentDtos(List<Comment> comments) {
        this.comments = comments.stream().map(comment -> new AddCommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getWriter().getId()
        )).collect(Collectors.toList());
    }
}
