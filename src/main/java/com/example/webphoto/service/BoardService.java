package com.example.webphoto.service;

import com.example.webphoto.domain.*;
import com.example.webphoto.domain.enums.BoardShare;
import com.example.webphoto.domain.enums.BoardType;
import com.example.webphoto.domain.enums.UserType;
import com.example.webphoto.dto.*;
import com.example.webphoto.dto.Friend.FriendDTO;
import com.example.webphoto.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
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
    private final TagRepository tagRepository;
    private final BlackService blackService;
    private final FriendshipService friendshipService;
    private final CloseFriendService closeFriendService;
    private final UserRepository userRepository;
    private final LookedBoardRepository lookedBoardRepository;
    private final EventService eventService;

    private BoardPreviewResponse entityToPreviewResponse(Board board) {
        MediaResponse thumbnail = new MediaResponse();
        // NOTICE 타입이 아닐 경우에만 썸네일 설정
        if (board.getType() != BoardType.NOTICE && !board.getMedia().isEmpty()) {
            thumbnail.set(board.getMedia().get(0).getMedia());
        }

        List<String> tagList = board.getTags().stream()
                .map(boardTag -> {
                    String tagName = boardTag.getTag().getName();
                    System.out.println(tagName);
                    return tagName;
                })
                .collect(Collectors.toList());

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


    public BoardResponse entityToResponse(Board board) {
        List<String> tagList = board.getTags().stream()
                .map(boardTag -> {
                    String tagName = boardTag.getTag().getName();
                    System.out.println(tagName);
                    return tagName;
                })
                .collect(Collectors.toList());

        // 태그 내용에 사용자의 이름이 포함된 경우
        for (String tagName : tagList) {
            if (userService.findById(tagName) != null) {
                List<TagAlaramResponse> tagAlarmResponse = tagAlaram(tagName);
                if (tagAlarmResponse != null) {
                    System.out.println("사용자에 대한 태그 알람: " + tagName + " - " + tagAlarmResponse);
                }
            }
        }

        List<MediaResponse> mediaList = board.getMedia().stream()
                .map(mediaBoard -> new MediaResponse(mediaBoard.getMedia().getName(), mediaBoard.getMedia().getCategory()))
                .peek(System.out::println)
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

    // 사용자에게 태그 알림 전송
    public List<TagAlaramResponse> tagAlaram(String tagName) {
        return tagRepository.findByName(tagName).stream()
                .flatMap(tag -> tag.getBoards().stream())
                .sorted(Comparator.comparing(boardTag -> boardTag.getBoard().getCreatedAt(), Comparator.reverseOrder())) // 태그가 포함된 게시글 목록을 작성 시간 기준으로 내림 차순
                .map(boardTag -> {
                    Board board = boardTag.getBoard();
                    TagAlaramResponse response = new TagAlaramResponse();
                    response.setTitle(board.getTitle());
                    response.setContent(board.getContent());
                    response.setWriterId(board.getWriter().getId());
                    return response;
                })
                .collect(Collectors.toList());
    }

    // AddBoardRequest DTO를 Board 엔티티로 변환
    private Board requestToEntity(BoardRequest dto) {
        User user = userService.findById(dto.getWriterId());
        String[] tagNames = dto.getTags().split("[#@]");
        List<Tag> tags = tagService.addTag(tagNames);

        List<BoardTag> boardTags = tags.stream()
                .map(tag -> new BoardTag(null, null, tag))
                .collect(Collectors.toList());

        // NOTICE, EVENT 타입 게시글일 경우 미디어 리스트를 초기화 X
        List<MediaBoard> mediaBoards = new ArrayList<>();
        if (dto.getType() != BoardType.NOTICE && dto.getType() != BoardType.EVENT) {
            for (int i = 0; i < dto.getMediaNames().length; i++) {
                Media media = mediaRepository.findByOwnerAndCategoryAndName(user, dto.getCategories()[i], dto.getMediaNames()[i]);
                mediaBoards.add(new MediaBoard(null, media, null));
            }
        }

        return Board.builder()
                .title(dto.getTitle())
                .createdAt(LocalDateTime.now())
                .content(dto.getContent())
                .media(mediaBoards)
                .tags(boardTags)
                .view(0)
                .like(0)
                .bookmark(0)
                .share(dto.getShare())
                .type(dto.getType())
                .writer(user)
                .build();
    }

    // 게시글 작성
    @Transactional
    public BoardResponse addBoard(BoardRequest dto) {
        User user = userService.findById(dto.getWriterId());

        if (user.getUserType() != UserType.ADMIN && dto.getType() == BoardType.EVENT) {
            List<String> adminEventTags = eventService.getAdminEventTags();
            eventService.validateEventTags(dto, adminEventTags);
        }

        Board saved = boardRepository.save(requestToEntity(dto));

        // 게시글 타입이 공지사항, 이벤트가 아니면 미디어 저장
        if (saved.getType() != BoardType.NOTICE && saved.getType() != BoardType.EVENT) {
            mediaBoardRepository.saveAll(saved.getMedia());
        }
        // 모든 게시글에 대해 태그 저장
        boardTagRepository.saveAll(saved.getTags());

        return entityToResponse(saved);
    }

    // TOP3 게시물 가져오기
    public List<BoardPreviewResponse> getTop3BoardsByType(BoardType boardType) {
        PageRequest pageRequest = PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "view"));
        List<Board> boards = boardRepository.findByType(boardType, pageRequest).getContent();
        return boards.stream().map(this::entityToPreviewResponse).collect(Collectors.toList());
    }

    // 게시물 종류별로 전체 불러오기(추가로 블랙리스트 된 유저들의 게시글들은 필터링 되서 숨김처리)
    public Page<BoardPreviewResponse> findAllByBoardType(BoardType boardType, int page, int size, String sortValue, String sortOrder, Principal principal) throws Exception {
        Sort sort = Sort.by(sortValue);

        if ("desc".equalsIgnoreCase(sortOrder)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        User user = userRepository.findById(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        List<String> blacklistedUserIds = blackService.getBlackUser().stream()
                .map(black -> black.getBlackUser().getId())
                .toList();

        List<String> friendUserIds = friendshipService.findFriendsByUserEmail(user.getEmail()).stream()
                .map(FriendDTO::getFriendName)
                .toList();

        List<String> closeFriendUserIds = closeFriendService.getAddedByCloseFriends(user.getId()).stream()
                .map(CloseFriendResponse::getUserId)
                .toList();

        List<Long> lookedBoardIds = lookedBoardRepository.findByUser(user).stream()
                .map(lookedBoard -> lookedBoard.getBoard().getId())
                .toList();

        List<Board> allBoards;
        if (user.getUserType() == UserType.ADMIN) {
            // 관리자는 모든 게시글을 필터링 없이 가져옴
            allBoards = boardRepository.findByType(boardType, sort).stream()
                    .filter(board -> !blacklistedUserIds.contains(board.getWriter().getId()))
                    .collect(Collectors.toList());
        } else {
            allBoards = boardRepository.findByType(boardType, sort).stream()
                    .filter(board -> !blacklistedUserIds.contains(board.getWriter().getId()))
                    .filter(board -> board.getShare() == BoardShare.PUBLIC ||
                            (board.getShare() == BoardShare.FRIEND && (friendUserIds.contains(board.getWriter().getId()) || board.getWriter().getId().equals(user.getId()))) ||
                            (board.getShare() == BoardShare.CLOSE_FRIEND && (closeFriendUserIds.contains(board.getWriter().getId()) || board.getWriter().getId().equals(user.getId()))) ||
                            (board.getShare() == BoardShare.PRIVATE && board.getWriter().getId().equals(user.getId())) || board.getWriter().getId().equals(user.getId()))
                    .collect(Collectors.toList());
        }

        // 필터링된 게시글에서 한번도 보지 않은 게시글들을 상위에 추가
        List<BoardPreviewResponse> newBoards = allBoards.stream()
                .filter(board -> !lookedBoardIds.contains(board.getId()))
                .map(this::entityToPreviewResponse)
                .toList();

        // 필터링된 게시글들 중 이미 본 게시글들을 아래에 추가(가장 최근에 봤던 게시글이 가장 아래로감)
        List<BoardPreviewResponse> seenBoards = lookedBoardRepository.findByUser(user).stream()
                .filter(lookedBoard -> lookedBoard.getBoard().getType() == boardType)
                .sorted(Comparator.comparing(LookedBoard::getDate))
                .map(lookedBoard -> entityToPreviewResponse(lookedBoard.getBoard()))
                .toList();

        List<BoardPreviewResponse> sortedBoards = new ArrayList<>();
        sortedBoards.addAll(newBoards);
        sortedBoards.addAll(seenBoards);

        // 필터링된 결과로 페이지 객체 생성
        int start = Math.min((int) pageable.getOffset(), sortedBoards.size());
        int end = Math.min((start + pageable.getPageSize()), sortedBoards.size());
        List<BoardPreviewResponse> paginatedBoards = sortedBoards.subList(start, end);

        return new PageImpl<>(paginatedBoards, pageable, allBoards.size());
    }

    // 전체 게시글
    public List<BoardPreviewResponse> findAll(String sortType, boolean isDesc) {
        return boardRepository.findAll().stream()
                .map(this::entityToPreviewResponse)
                .collect(Collectors.toList());
    }

    public BoardResponse findById(Long id) {
        return entityToResponse(boardRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 게시글을 찾을 수 없습니다.")));
    }

    // 게시글 수정(제목, 내용, 태그)
    @Transactional
    public BoardResponse updateBoard(Long id, BoardRequest dto) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 게시글을 찾을 수 없습니다: " + id));

        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());

        // 기존의 모든 태그 삭제
        if (!board.getTags().isEmpty()) {
            boardTagRepository.deleteAll(board.getTags());
            board.getTags().clear();
        }
        // 새 태그 처리
        Arrays.stream(dto.getTags().split("[#@]"))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .forEach(tagName -> {
                    Tag tag = tagRepository.findByName(tagName).stream().findFirst().orElseGet(() -> tagRepository.save(new Tag(null, tagName)));
                    board.getTags().add(new BoardTag(null, board, tag));
                });

        return entityToResponse(boardRepository.save(board));
    }

    @Transactional
    public void deleteBoard(Long id, String userId) throws IOException {
        Board board = boardRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 게시글을 찾을 수 없습니다."));
        User user = userService.findById(userId);
        // 게시글 유형이 포즈인 경우에만 파일 삭제 로직 수행
        if (board.getWriter().getId().equals(userId) || user.getUserType() == UserType.ADMIN) {
            if (board.getType() == BoardType.POSE) {
                for (MediaBoard mediaBoard : board.getMedia()) {
                    Media media = mediaBoard.getMedia();
                    Path filePath = Paths.get("./front4/public/images/" + userId + "/pose/" + media.getName());
                    if (Files.exists(filePath)) {
                        Files.delete(filePath);
                    }
                    mediaRepository.deleteById(media.getId());
                }
            }
            boardRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("작성자와 관리자만 게시글을 삭제할 수 있습니다.");
        }
    }
    // 특정 사용자의 게시글 목록을 가져옴
    public List<BoardResponse> getBoardByUser(String id) {
        return boardRepository.findByWriter_IdOrderByCreatedAtDesc(id).stream()
                .map(this::entityToResponse)
                .collect(Collectors.toList());
    }
    // 키워드로 게시물 검색(제목, 태그)
    public List<BoardPreviewResponse> getBoardByKeyWord(String keyword) throws Exception {
        if (keyword.endsWith("#")) {
            throw new Exception("#로 검색할 수는 없습니다");
        }
        // 태그,제목 검색
        List<Board> boardList = keyword.startsWith("#")
                ? boardRepository.searchByTag(keyword.substring(1))
                : boardRepository.searchByTitle(keyword);

        return boardList.stream()
                .map(this::entityToPreviewResponse)
                .collect(Collectors.toList());
    }
    // 조회수 증가(사용자가 게시글 상세보기 시), 게시물 상세 보기 시 해당 유저의 이미 본 게시글로 등록
    @Transactional
    public Board updateVisit(Board board, User user) {
        if (board != null) {
            board.setView(board.getView() + 1);
            boardRepository.save(board);
            // 이미 본 게시글 테이블에 등록된 게시글이면 본 시간만 업데이트
            LookedBoard lookedBoard = lookedBoardRepository.findByUserAndBoard(user, board)
                    .orElseGet(() -> new LookedBoard(null, LocalDateTime.now(), user, board)); // 최초
            lookedBoard.setDate(LocalDateTime.now()); // 이미 등록된 게시글
            lookedBoardRepository.save(lookedBoard);
        }
        return board;
    }

    // 좋아요
    @Transactional
    public Board addLike(Long id, User user) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!likeRepository.existsByUserAndBoard(user, board)) {
            board.setLike(board.getLike() + 1);
            likeRepository.save(new LikedBoard(null, user, board));
        } else {
            // 같은 유저가 좋아요를 누르면 개수 다시 감소
            board.setLike(board.getLike() - 1);
            likeRepository.deleteByUserAndBoard(user, board);
        }
        return boardRepository.save(board);
    }

    // 사용자(내가) 좋아요 누른 게시글 가져오기
    public List<Board> BoardsLikedByUser(User user) {
        return likeRepository.findByUser(user).stream()
                .map(LikedBoard::getBoard)
                .collect(Collectors.toList());
    }

    // 북마크
    @Transactional
    public Board addBookmark(Long id, User user) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        // 북마크가 이미 존재하는 확인
        boolean alreadyBookmarked = bookMarkRepository.existsByUserAndBoard(user, board);

        // 자신의 게시글인 경우 북마크 추가 또는 삭제
        if (!alreadyBookmarked) {
            // 없다면 추가
            board.setBookmark(board.getBookmark() + 1);
            bookMarkRepository.save(new BookmarkedBoard(null, user, board));
        } else {
            // 이미 한 게시글이면 삭제
            board.setBookmark(board.getBookmark() - 1);
            bookMarkRepository.deleteByUserAndBoard(user, board);
        }

        return boardRepository.save(board);
    }
    // 사용자가 북마크한 게시판 가져오기
    public List<Board> getBoardsBookmarkedByUser(User user) {
        return bookMarkRepository.findByUser(user).stream()
                .map(BookmarkedBoard::getBoard)
                .filter(board -> !board.getWriter().equals(user))
                .collect(Collectors.toList());
    }
}