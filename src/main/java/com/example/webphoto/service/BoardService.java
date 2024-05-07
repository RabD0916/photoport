package com.example.webphoto.service;

import com.example.webphoto.domain.*;
import com.example.webphoto.dto.AddBoardRequest;
import com.example.webphoto.dto.AddBoardResponse;
import com.example.webphoto.dto.GetBoardResponse;
import com.example.webphoto.dto.GetMedia;
import com.example.webphoto.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserService userService;
    private final TagService tagService;
    private final BoardTagRepository boardTagRepository;
    private final MediaRepository mediaRepository;
    private final MediaBoardRepository mediaBoardRepository;
    private final CommentRepository commentRepository;
    private final TagRepository tagRepository;

    // Baord 엔티티를 GetMemoResponse DTO로 변환
    private GetBoardResponse entityToResponse(Board board) {
        List<GetMedia> getMediaList = new ArrayList<>();
//        for(Media media : mediaRepository.findByBoards(board.getMedia())) {
//            getMediaList.add(new GetMedia(media.getName(), media.getCategory()));
//        }



        return new GetBoardResponse(
                board.getId(),
                board.getTitle(),
                board.getCreatedAt(),
                board.getContent(),
                board.getView(),
                board.getLike(),
                board.getBookmark(),
                board.getShare(),
                board.getType(),
                board.getWriter().getId(),
                new ArrayList<Media>(),                 // 아직 해결 못함
                commentRepository.findByBoard(board),
                new ArrayList<Tag>()                    // 아직 해결 못함
        );
    }

    // AddBoardRequest DTO를 Board 엔티티로 변환
    private Board requestToEntity(AddBoardRequest dto) {
        User user = userService.findById(dto.getWriterId());

        String[] tagNames = dto.getTags().split("[#@]");
        List<Tag> tags = tagService.addTag(tagNames);
        List<BoardTag> boardTags = new ArrayList<>();
        for(Tag tag : tags) {
            boardTags.add(new BoardTag(null, null, tag));
        }

        String[] categories = dto.getCategories();
        String[] mediaNames = dto.getMediaNames();
        List<Media> mediaList = new ArrayList<>();
        List<MediaBoard> mediaBoards = new ArrayList<>();

        if(categories.length != mediaNames.length) {
            return null;
        }
        for(int i=0; i<mediaNames.length; i++) {
            mediaList.add(mediaRepository.findByOwnerAndCategoryAndName(user, categories[i], mediaNames[i]));
        }
        for(Media media : mediaList) {
            mediaBoards.add(new MediaBoard(null, media, null));
        }


        return new Board(
                null,
                dto.getTitle(),
                LocalDateTime.now(),
                dto.getContent(),
                mediaBoards,
                boardTags,
                dto.getShare(),
                dto.getType(),
                user
        );
    }


    private AddBoardResponse entityToResult(Board board) {
        return new AddBoardResponse(
                board.getTitle(),
                board.getContent(),
                board.getShare(),
                board.getType()
        );
    }

    public List<GetBoardResponse> findAll() {
        return boardRepository.findAll().stream()
                .map(board -> entityToResponse(board))
                .collect(Collectors.toList());
    }

    // 게시글을 추가하는 메소드
    public AddBoardResponse addBoard(AddBoardRequest dto) {
        Board saved = boardRepository.save(requestToEntity(dto));
        List<BoardTag> boardTags = new ArrayList<>();
        for(BoardTag boardTag : saved.getTags()) {
            boardTags.add(boardTagRepository.save(boardTag));
        }
        return entityToResult(saved);
    }

    // 게시글을 수정하는 메소드
    public GetBoardResponse updateBoard(Long id, AddBoardRequest dto) {

        // 코드 리펙터링(by 시영이형)
//        Board board = boardRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 게시글을 찾을 수 없습니다."));

        // 여기서부터 아래부분 해당 메소드 코드 고쳐야함
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
