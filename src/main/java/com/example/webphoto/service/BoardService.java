package com.example.webphoto.service;

import com.example.webphoto.config.CustomException;
import com.example.webphoto.domain.*;
import com.example.webphoto.domain.enums.BoardType;
import com.example.webphoto.dto.*;
import com.example.webphoto.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserService userService;
    private final TagService tagService;
    private final BoardTagRepository boardTagRepository;
    private final MediaRepository mediaRepository;
    private final MediaBoardRepository mediaBoardRepository;
    private final CommentService commentService;
    private final LikeRepository likeRepository;
    private final BookMarkRepository bookMarkRepository;

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
                board.getType(),
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
        System.out.println("게시글 종류 : " + dto.getType()); // 게시글 종류 : POSE 찍히는데 왜 다 NORMAL로 처들어감

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

    public List<BoardPreviewResponse> findAllByBoardType(BoardType boardType) {
        return boardRepository.findByType(boardType).stream()
                .map(this::entityToPreviewResponse)
                .collect(Collectors.toList());
    }


    // 전체 게시글(종류 상관없이)
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

    @Transactional
    public void deleteBoard(Long id, String userId) throws IOException {
        Optional<Board> board = boardRepository.findById(id);
        if (board.isPresent() && board.get().getWriter().getId().equals(userId)) {
            // 게시글 유형이 포즈(POSE)인 경우에만 파일 삭제 로직 수행
            if (board.get().getType() == BoardType.POSE) {
                List<MediaBoard> mediaList = board.get().getMedia();

                // 각 파일을 서버에서 삭제
                for (MediaBoard mediaBoard : mediaList) {
                    Media media = mediaBoard.getMedia();
                    String path = "./front4/public/images/" + userId + "/pose/" + media.getName();
                    Path filePath = Paths.get(path);
                    if (Files.exists(filePath)) {
                        Files.delete(filePath); // 파일 삭제
                    }
                    mediaRepository.deleteById(media.getId()); // 미디어 레코드 삭제
                }
            }

            // 미디어 파일 처리 후 게시글 삭제
            boardRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("작성자만 게시글을 삭제할 수 있습니다.");
        }
    }


    // 특정 사용자의 게시글 목록을 가져오는 메소드
    public List<BoardResponse> getBoardByUser(String id) {
        return boardRepository.findByWriter_IdOrderByCreatedAtDesc(id).stream()
                .map(this::entityToResponse)
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

    // 북마크 기능
    @Transactional
    public Board addBookmark(Long id, User user) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // 북마크가 이미 존재하는지 확인
        boolean alreadyBookmarked = bookMarkRepository.existsByUserAndBoard(user, board);

        // 자신의 게시글인 경우 북마크 추가 또는 삭제
        if (user.equals(board.getWriter())) {
            if (!alreadyBookmarked) {
                // 북마크가 없다면 추가
                board.setBookmark(board.getBookmark() + 1);
                bookMarkRepository.save(new BookmarkedBoard(null, user, board));
            } else {
                // 이미 북마크가 있다면 삭제
                if (board.getBookmark() > 0) {
                    board.setBookmark(board.getBookmark() - 1);
                    bookMarkRepository.deleteByUserAndBoard(user, board);
                }
            }
        } else {
            // 다른 사용자의 게시글 처리
            if (!alreadyBookmarked) {
                board.setBookmark(board.getBookmark() + 1);
                bookMarkRepository.save(new BookmarkedBoard(null, user, board));
            } else {
                if (board.getBookmark() > 0) {
                    board.setBookmark(board.getBookmark() - 1);
                    bookMarkRepository.deleteByUserAndBoard(user, board);
                }
            }
        }

        // 게시판 정보 업데이트
        Board updatedBoard = boardRepository.save(board);
        return updatedBoard;
    }



}
