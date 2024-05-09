package com.example.webphoto.service;

import com.example.webphoto.config.CustomException;
import com.example.webphoto.domain.*;
import com.example.webphoto.dto.*;
import com.example.webphoto.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private final CommentService commentService;
    private final LikeRepository likeRepository;

    // Baord 엔티티를 GetMemoResponse DTO로 변환
    private BoardPreviewResponse entityToPreviewResponse(Board board) {
        List<MediaBoard> mediaBoardList = board.getMedia();
        MediaResponse thumbnail = new MediaResponse();
        thumbnail.set(mediaBoardList.get(0).getMedia());
        List<BoardTag> boardTagList = board.getTags();
        List<String> tagList = new ArrayList<>();

        for(BoardTag boardTag : boardTagList) {
            Tag tag = boardTag.getTag();
            tagList.add(tag.getName());
            System.out.println(tag.getName());
        }

        return new BoardPreviewResponse(
                board.getId(),
                board.getTitle(),
                board.getCreatedAt(),
                board.getView(),
                board.getLike(),
                board.getBookmark(),
                board.getWriter().getId(),
                board.getWriter().getUserNick(),
                thumbnail,
                tagList
        );
    }

    private BoardResponse entityToResponse(Board board) {
        List<MediaBoard> mediaBoardList = board.getMedia();
        List<BoardTag> boardTagList = board.getTags();
        List<MediaResponse> mediaList = new ArrayList<>();
        List<String> tagList = new ArrayList<>();

        for(BoardTag boardTag : boardTagList) {
            Tag tag = boardTag.getTag();
            tagList.add(tag.getName());
            System.out.println(tag.getName());
        }
        for(MediaBoard mediaBoard : mediaBoardList) {
            Media media = mediaBoard.getMedia();
            mediaList.add(new MediaResponse(media.getName(), media.getCategory()));
            System.out.println(mediaList.get(mediaList.size()-1));
        }

        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                board.getCreatedAt(),
                board.getContent(),
                board.getView(),
                board.getLike(),
                board.getBookmark(),
                board.getWriter().getId(),
                board.getWriter().getUserNick(),
                mediaList,
                commentService.findAllComments(board.getId()), // 이곳도 서비스에서 해당 게시글에 등록된 모든 댓글 가져오는 dto 반환하는걸로 수정
                tagList
        );
    }

    // AddBoardRequest DTO를 Board 엔티티로 변환
    private Board requestToEntity(BoardRequest dto) {
        User user = userService.findById(dto.getWriterId());
        String[] tagNames = dto.getTags().split("[#@]");
        String[] categories = dto.getCategories();
        String[] mediaNames = dto.getMediaNames();

        List<Tag> tags = tagService.addTag(tagNames);
        List<BoardTag> boardTags = new ArrayList<>();
        List<MediaBoard> mediaBoards = new ArrayList<>();

        for(Tag tag : tags) {
            boardTags.add(new BoardTag(null, null, tag));
        }
        for(int i=0; i<mediaNames.length; i++) {
            Media media = mediaRepository.findByOwnerAndCategoryAndName(user, categories[i], mediaNames[i]);
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

    public List<BoardPreviewResponse> findAll() {
        return boardRepository.findAll().stream()
                .map(this::entityToPreviewResponse)
                .collect(Collectors.toList());
    }

    public BoardResponse findById(Long id) {
        return entityToResponse(boardRepository.findById(id).orElse(null));
    }

    // 게시글을 추가하는 메소드
    public BoardResponse addBoard(BoardRequest dto) {
        Board saved = boardRepository.save(requestToEntity(dto));

        mediaBoardRepository.saveAll(saved.getMedia());
        boardTagRepository.saveAll(saved.getTags());

        return entityToResponse(saved);
    }

    // 게시글을 수정하는 메소드
    public BoardResponse updateBoard(Long id, BoardRequest dto) {

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
    public List<BoardResponse> getBoardByUser(String id) {
        return boardRepository.findByWriter_IdOrderByCreatedAtDesc(id).stream()
                .map(board -> entityToResponse(board))
                .collect(Collectors.toList());
    }

    // 키워드로 게시물 검색하는 메소드
    public List<BoardPreviewResponse> getBoardByKeyWord(String keyword) throws Exception {
        List<Board> boardList;
        if (keyword.endsWith("#")) {
            throw new Exception("#로 검색할 수는 없습니다");
        }
        if (keyword.startsWith("#")) {
            // 태그 검색 로직
            String tagKeyword = keyword.substring(1); // '#' 제거
            boardList = boardRepository.searchByTitleOrContentOrTag(tagKeyword);
        } else {
            // 기본 검색 로직
            boardList = boardRepository.searchByTitleOrContentOrTag(keyword);
        }
        return boardList.stream()
                .map(this::entityToPreviewResponse)
                .collect(Collectors.toList());
    }

    // 조회수 증가(사용자가 해당 게시글 클릭 시)
    public Board updateVisit(Board board) {
        Board target = boardRepository.findById(board.getId()).orElseThrow(() ->
                new CustomException("게시글을 찾을 수없습니다.", HttpStatus.NOT_FOUND));
        target.setView(target.getView() + 1);
        boardRepository.save(target);
        return target;
    }

    // 좋아요 기능
    @Transactional
    public Board addLike(Long id, User user) {

        Board board = boardRepository.findById(id).orElse(null);
        if (!likeRepository.existsByUserAndBoard(user, board)) {
            // 호출되면 board에 like 증가
            board.setLike(board.getLike() + 1);
            likeRepository.save(new LikedBoard(null, user, board));
        }
        else{
            // 같은 유저가 좋아요를 누르면 좋아요 개수 하나 감소
            board.setLike(board.getLike() - 1);
            likeRepository.deleteByUserAndBoard(user, board);
        }
        Board updatedBoard = boardRepository.save(board);
        return updatedBoard;
    }
}
