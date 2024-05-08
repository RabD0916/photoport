package com.example.webphoto.service;

import com.example.webphoto.domain.*;
import com.example.webphoto.dto.*;
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
    private final CommentService commentService;
    private final TagRepository tagRepository;

    // Baord 엔티티를 GetMemoResponse DTO로 변환
    private GetBoardPreviewResponse entityToPreviewResponse(Board board) {
        List<MediaBoard> mediaBoardList = board.getMedia();
        GetMedia thumbnail = new GetMedia();
        thumbnail.set(mediaBoardList.get(0).getMedia());

        return new GetBoardPreviewResponse(
                board.getId(),
                board.getTitle(),
                board.getCreatedAt(),
                board.getView(),
                board.getLike(),
                board.getBookmark(),
                board.getWriter().getId(),
                thumbnail
        );
    }

    private GetBoardResponse entityToResponse(Board board) {
        List<MediaBoard> mediaBoardList = board.getMedia();
        List<BoardTag> boardTagList = board.getTags();
        List<GetMedia> mediaList = new ArrayList<>();
        List<String> tagList = new ArrayList<>();

        for(BoardTag boardTag : boardTagList) {
            Tag tag = boardTag.getTag();
            tagList.add(tag.getName());
            System.out.println(tag.getName());
        }
        for(MediaBoard mediaBoard : mediaBoardList) {
            Media media = mediaBoard.getMedia();
            mediaList.add(new GetMedia(media.getName(), media.getCategory()));
            System.out.println(mediaList.get(mediaList.size()-1));
        }

        return new GetBoardResponse(
                board.getId(),
                board.getTitle(),
                board.getCreatedAt(),
                board.getContent(),
                board.getView(),
                board.getLike(),
                board.getBookmark(),
                board.getWriter().getId(),
                mediaList,
                commentService.findAllComments(board.getId()), // 이곳도 서비스에서 해당 게시글에 등록된 모든 댓글 가져오는 dto 반환하는걸로 수정
                tagList
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
        System.out.println("미디어 : " + Arrays.toString(dto.getMediaNames()));
        System.out.println("미디어 개수 : " + dto.getMediaNames().length);
        System.out.println("카테고리 개수 : " + dto.getCategories().length);

        String[] categories = dto.getCategories();
        String[] mediaNames = dto.getMediaNames();
        List<Media> mediaList = new ArrayList<>();
        List<MediaBoard> mediaBoards = new ArrayList<>();

        if(categories.length != mediaNames.length) {
            return null;
        }
        for(int i=0; i<mediaNames.length; i++) {
            mediaList.add(mediaRepository.findByOwnerAndCategoryAndName(user, categories[i], mediaNames[i]));
            System.out.println(i + " : 유저 : " + user.getId() + " : 카테고리 : " + categories[i] + " : 미디어 : " + mediaNames[i]);
            System.out.println(i + " : " + mediaRepository.findByOwnerAndCategoryAndName(user, categories[i], mediaNames[i]));
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

    public List<GetBoardPreviewResponse> findAll() {
        return boardRepository.findAll().stream()
                .map(board -> entityToPreviewResponse(board))
                .collect(Collectors.toList());
    }

    public GetBoardResponse findById(Long id) {
        return entityToResponse(boardRepository.findById(id).orElse(null));
    }

    // 게시글을 추가하는 메소드
    public AddBoardResponse addBoard(AddBoardRequest dto) {
        Board saved = boardRepository.save(requestToEntity(dto));
        List<BoardTag> boardTagList = new ArrayList<>();
        List<MediaBoard> mediaBoardList = new ArrayList<>();
        for(MediaBoard mediaBoard : saved.getMedia()) {
            mediaBoardList.add(mediaBoardRepository.save(mediaBoard));
        }
        for(BoardTag boardTag : saved.getTags()) {
            boardTagList.add(boardTagRepository.save(boardTag));
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
