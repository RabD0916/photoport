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
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
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
    private final MediaService mediaService;

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
                    User writer = board.getWriter();

                    List<MediaResponse> mediaList = board.getMedia().stream()
                            .map(mediaBoard -> new MediaResponse(mediaBoard.getMedia().getName(), mediaBoard.getMedia().getCategory()))
                            .collect(Collectors.toList());

                    List<String> tagList = board.getTags().stream()
                            .map(bt -> bt.getTag().getName())
                            .collect(Collectors.toList());

                    TagAlaramResponse response = new TagAlaramResponse();
                    response.setId(board.getId());
                    response.setTitle(board.getTitle());
                    response.setContent(board.getContent());
                    response.setWriterId(writer.getId());
                    response.setWriterName(writer.getUserNick());
                    response.setMedia(mediaList);
                    response.setTags(tagList);
                    response.setView(board.getView());
                    response.setLike(board.getLike());
                    response.setBookmark(board.getBookmark());
                    response.setCreatedAt(board.getCreatedAt());

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

        List<MediaBoard> mediaBoards = new ArrayList<>();
        if (dto.getType() != BoardType.NOTICE) {
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

        // 유저가 이벤트 게시글을 작성할 때 관리자가 작성한 이벤트 게시글이 있는지 체크
        if (user.getUserType() != UserType.ADMIN && dto.getType() == BoardType.EVENT) {
            List<Board> adminEventBoards = boardRepository.findByWriterTypeAndType(UserType.ADMIN, BoardType.EVENT);
            if (adminEventBoards.isEmpty()) {
                throw new IllegalArgumentException("관리자가 작성한 이벤트 게시글이 없어서 이벤트 게시글을 작성할 수 없습니다.");
            }
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
// 게시물 종류별로 전체 불러오기 (블랙리스트 유저의 게시글 필터링, 공개 범위 필터링만 적용)
    public Page<BoardPreviewResponse> findAllByBoardType(BoardType boardType, int page, int size, String sortValue, String sortOrder, Principal principal) throws Exception {
        Sort sort;

        // 정렬 기준과 순서 설정
        if ("desc".equalsIgnoreCase(sortOrder)) {
            sort = Sort.by(Sort.Order.desc(sortValue));
        } else {
            sort = Sort.by(Sort.Order.asc(sortValue));
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        User user = userRepository.findById(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        List<String> blacklistedUserIds = blackService.getBlackUser().stream()
                .map(black -> black.getBlackUser().getId())
                .collect(Collectors.toList());

        List<String> friendUserIds = friendshipService.findFriendsByUserEmail(user.getEmail()).stream()
                .map(FriendDTO::getFriendName)
                .collect(Collectors.toList());

        List<String> closeFriendUserIds = closeFriendService.getAddedByCloseFriends(user.getId()).stream()
                .map(CloseFriendResponse::getUserId)
                .collect(Collectors.toList());

        List<Board> allBoards = boardRepository.findByType(boardType, sort).stream()
                .filter(board -> !blacklistedUserIds.contains(board.getWriter().getId()))
                .filter(board -> board.getShare() == BoardShare.PUBLIC ||
                        (board.getShare() == BoardShare.FRIEND &&
                                (friendUserIds.contains(board.getWriter().getId()) || board.getWriter().getId().equals(user.getId()))) ||
                        (board.getShare() == BoardShare.CLOSE_FRIEND &&
                                (closeFriendUserIds.contains(board.getWriter().getId()) || board.getWriter().getId().equals(user.getId()))) ||
                        (board.getShare() == BoardShare.PRIVATE && board.getWriter().getId().equals(user.getId())))
                .collect(Collectors.toList());

        // 필터링된 결과로 페이지 객체 생성
        int start = Math.min((int) pageable.getOffset(), allBoards.size());
        int end = Math.min((start + pageable.getPageSize()), allBoards.size());
        List<BoardPreviewResponse> paginatedBoards = allBoards.subList(start, end).stream()
                .map(this::entityToPreviewResponse)
                .collect(Collectors.toList());

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

    // 게시글 수정(제목, 내용, 태그, 사진)
    @Transactional
    public BoardResponse updatePose(Long id, BoardRequest dto, List<MultipartFile> newFiles) {
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

        // 포즈 게시판(Pose)일 경우에만 사진 처리
        if (board.getType() == BoardType.POSE && newFiles != null && !newFiles.isEmpty()) {
            String path = "./front4/public/images/";
            String dir = path + board.getWriter().getId() + "/pose";
            File folder = new File(dir);

            if (!folder.exists() && !folder.mkdirs()) {
                throw new RuntimeException("사진 저장 디렉토리를 생성할 수 없습니다.");
            }

            // 기존 파일 삭제
            for (MediaBoard mediaBoard : board.getMedia()) {
                Media media = mediaBoard.getMedia();
                String filePath = folder.getAbsolutePath() + "/" + media.getName();
                File file = new File(filePath);
                if (file.exists()) {
                    file.delete();
                }
                mediaRepository.deleteById(media.getId());
            }
            board.getMedia().clear();

            // 새로운 파일 저장 및 Media, MediaBoard 연관 데이터 추가
            for (MultipartFile file : newFiles) {
                try {
                    String fileName = file.getOriginalFilename();
                    Path filePath = Paths.get(folder.getAbsolutePath() + "/" + fileName);

                    // 파일 이름 중복 확인
                    if (Files.exists(filePath)) {
                        // 중복되는 경우 UUID를 사용하여 파일 이름 변경
                        String randomFileName = UUID.randomUUID() + "_" + fileName;
                        filePath = Paths.get(folder.getAbsolutePath() + "/" + randomFileName);
                        fileName = randomFileName;
                    }

                    // 파일 쓰기
                    Files.write(filePath, file.getBytes(), StandardOpenOption.CREATE_NEW);

                    // Media 엔티티 생성 및 저장
                    Media media = Media.builder()
                            .name(fileName)
                            .date(LocalDateTime.now())
                            .category("pose")
                            .owner(board.getWriter())
                            .build();
                    mediaRepository.save(media);

                    // MediaBoard 엔티티 생성 및 저장
                    MediaBoard mediaBoard = new MediaBoard(null, media, board);
                    board.getMedia().add(mediaBoard);
                    mediaBoardRepository.save(mediaBoard);
                } catch (IOException e) {
                    e.printStackTrace();
                    return new BoardResponse();
                }
            }
        }

        return entityToResponse(boardRepository.save(board));
    }


    @Transactional
    public void deleteBoard(Long id, String userId) throws IOException {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글을 찾을 수 없습니다."));
        User user = userService.findById(userId);

        // 작성자 또는 관리자인 경우에만 삭제 가능
        if (board.getWriter().getId().equals(userId) || user.getUserType() == UserType.ADMIN) {
            // 게시글 유형이 포즈인 경우 파일 삭제 로직 수행
            if (board.getType() == BoardType.POSE || board.getType() == BoardType.EVENT) {
                String folderName = board.getType() == BoardType.POSE ? "pose" : "event";
                for (MediaBoard mediaBoard : board.getMedia()) {
                    Media media = mediaBoard.getMedia();
                    Path filePath = Paths.get("./front4/public/images/" + userId + "/" + folderName + "/" + media.getName());
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