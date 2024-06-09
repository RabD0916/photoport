package com.example.webphoto.service;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.enums.BoardType;
import com.example.webphoto.domain.enums.UserType;
import com.example.webphoto.dto.BoardRequest;
import com.example.webphoto.dto.BoardResponse;
import com.example.webphoto.dto.MediaResponse;
import com.example.webphoto.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    private final BoardRepository boardRepository;
    private final CommentService commentService;

    public List<String> getAdminEventTags() {
        List<Board> adminEventBoards = boardRepository.findByWriterTypeAndType(UserType.ADMIN, BoardType.EVENT);

        return adminEventBoards.stream()
                .flatMap(board -> board.getTags().stream())
                .map(boardTag -> boardTag.getTag().getName())
                .filter(tag -> !tag.isBlank())
                .collect(Collectors.toList());
    }

    public void validateEventTags(BoardRequest dto, List<String> adminEventTags) {
        List<String> userTags = Arrays.stream(dto.getTags().split("#"))
                .filter(tag -> !tag.isBlank())
                .toList();

        for (String tag : adminEventTags) {
            if (!userTags.contains(tag)) {
                throw new IllegalArgumentException("이벤트 태그가 포함되지 않았습니다: " + tag);
            }
        }
    }

    // 관리자가 작성한 이벤트 게시글 조회
    public List<BoardResponse> getEventBoard() {
        // 관리자 작성 이벤트 게시글을 조회
        List<Board> adminEventBoards = boardRepository.findByWriterTypeAndType(UserType.ADMIN, BoardType.EVENT);

        return adminEventBoards.stream()
                .map(this::entityToResponse)
                .collect(Collectors.toList());
    }


    // 이벤트에 참여한 게시글들 리스트
    public List<BoardResponse> getEventBoards() {
        // 먼저 관리자 작성 이벤트 게시글을 조회
        List<Board> adminEventBoards = boardRepository.findByWriterTypeAndType(UserType.ADMIN, BoardType.EVENT);
        List<Long> adminEventBoardIds = adminEventBoards.stream()
                .map(Board::getId)
                .toList();

        // 모든 이벤트 게시글을 조회한 후 관리자 게시글을 필터링하여 제외
        List<Board> allEventBoards = boardRepository.findByType(BoardType.EVENT);
        List<Board> participationPosts = allEventBoards.stream()
                .filter(board -> !adminEventBoardIds.contains(board.getId()))
                .toList();

        return participationPosts.stream()
                .map(this::entityToResponse)
                .collect(Collectors.toList());
    }

    private BoardResponse entityToResponse(Board board) {
        List<MediaResponse> mediaList = board.getMedia().stream()
                .map(mediaBoard -> new MediaResponse(mediaBoard.getMedia().getName(), mediaBoard.getMedia().getCategory()))
                .collect(Collectors.toList());

        List<String> tagList = board.getTags().stream()
                .map(boardTag -> boardTag.getTag().getName())
                .collect(Collectors.toList());

        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                board.getCreatedAt(),
                board.getContent(),
                board.getView(),
                board.getLike(),
                board.getBookmark(),
                board.getType(),
                board.getWriter().getId(),
                board.getWriter().getUserNick(),
                mediaList,
                commentService.findAllComments(board.getId()),
                tagList
        );
    }
}
