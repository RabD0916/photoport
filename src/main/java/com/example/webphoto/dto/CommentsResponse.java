package com.example.webphoto.dto;

import com.example.webphoto.domain.Comment;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class CommentsResponse {
    private List<CommentResponse> comments;

    public CommentsResponse(List<Comment> comments) {
        this.comments = comments.stream().map(comment -> new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getWriter().getId(),
                comment.getWriter().getUserNick()
        )).collect(Collectors.toList());
    }
}
