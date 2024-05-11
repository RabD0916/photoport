package com.example.webphoto.service;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.Comment;
import com.example.webphoto.domain.User;
import com.example.webphoto.dto.CommentRequest;
import com.example.webphoto.dto.CommentResponse;
import com.example.webphoto.dto.CommentsResponse;
import com.example.webphoto.repository.BoardRepository;
import com.example.webphoto.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;

    // 댓글 생성
    public CommentResponse addComment(Long boardId, CommentRequest dto, User writer) {
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new IllegalArgumentException("게시판을 찾을 수 없습니다"));

        Comment comment = new Comment(null, LocalDateTime.now(), dto.getContent(), board, writer);
        commentRepository.save(comment);

        return new CommentResponse(comment.getId(), comment.getContent(), comment.getWriter().getId(), comment.getWriter().getUserNick());
    }

    // 전체 댓글 조회(필요한지는 잘 모르겠음)
    public CommentsResponse findAllComments(Long boardId) {
        List<Comment> comments = commentRepository.findByBoardId(boardId);
        return new CommentsResponse(comments);
    }

    // 본인 댓글들 조회
    public CommentsResponse findUserComments(String userId) {
        List<Comment> comments = commentRepository.findByWriterId(userId);
        return new CommentsResponse(comments);
    }

    // 댓글 수정
    @Transactional
    public CommentResponse updateComment(Long commentId, CommentRequest request, User writer) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (!comment.getWriter().equals(writer)) {
            throw new IllegalArgumentException("댓글을 수정할 권한이 없습니다.");
        }

        comment.setContent(request.getContent());
        comment.setDate(LocalDateTime.now());
        commentRepository.save(comment);
        CommentResponse response = new CommentResponse(comment.getId(), comment.getContent(), comment.getWriter().getId(), comment.getWriter().getUserNick());
        return response;
    }

    // 댓글 삭제
    @Transactional
    public CommentResponse deleteComment(Long commentId, User writer) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (!comment.getWriter().equals(writer)) {
            throw new IllegalArgumentException("댓글을 삭제할 권한이 없습니다.");
        }

        commentRepository.delete(comment);
        CommentResponse response = new CommentResponse(commentId, comment.getContent(), writer.getId(), writer.getUserNick());
        return response;
    }
}