package com.example.webphoto.service;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.User;
import com.example.webphoto.dto.AddBoardRequest;
import com.example.webphoto.dto.AddBoardResponse;
import com.example.webphoto.dto.GetBoardResponse;
import com.example.webphoto.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserService userService;

    // Baord 엔티티를 GetMemoResponse DTO로 변환
    private GetBoardResponse entityToResponse(Board board) {
        return new GetBoardResponse(
                board.getId(),
                board.getTitle(),
                board.getCreatedAt(),
                board.getContent(),
                board.getView(),
                board.getLike(),
                board.getStat(),
                board.getType(),
                board.getWriter().getId()
        );
    }

    // AddBoardRequest DTO를 Board 엔티티로 변환
    private Board requestToEntity(AddBoardRequest dto) {
        User user = userService.findById(dto.getUsername());
        return new Board(
                null,
                dto.getTitle(),
                null,
                dto.getContent(),
                0,
                0,
                dto.getStat(),
                dto.getType(),
                user
        );
    }


    private AddBoardResponse entityToResult(Board board) {
        return new AddBoardResponse(
                board.getTitle(),
                board.getContent(),
                board.getStat(),
                board.getType()
        );
    }

    // 게시글을 추가하는 메소드
    public AddBoardResponse addBoard(AddBoardRequest dto, String[] urls) {
        Board board = boardRepository.save(requestToEntity(dto));
        return entityToResult(board);
    }

    // 게시글을 수정하는 메소드
    public GetBoardResponse updateBoard(Long id, AddBoardRequest dto) {
        Optional<Board> optionalBoard = boardRepository.findById(id);

        if (optionalBoard.isPresent()) {
            Board board = optionalBoard.get();
            board.setTitle(dto.getTitle());
            board.setContent(dto.getContent());
//            board.setFileName(dto.getFileName());

            boardRepository.save(board);

            return entityToResponse(board);
        } else {
            throw new IllegalArgumentException("해당 게시글을 찾을 수 없습니다: " + id);
        }
    }


    // 게시글을 삭제하는 메소드
    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }

    // 특정 사용자의 게시글 목록을 가져오는 메소드
    public List<GetBoardResponse> getBoardByUser(String id) {
        return boardRepository.findByWriter_IdOrderByCreatedAtDesc(id).stream()
                .map(board -> entityToResponse(board))
                .collect(Collectors.toList());
    }
}
