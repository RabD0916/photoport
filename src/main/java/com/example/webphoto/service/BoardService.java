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
            List<MediaBoard> mediaBoardList = board.getMedia();
            thumbnail.set(mediaBoardList.get(0).getMedia());
        }

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
                thumbnail,  // 이제 thumbnail은 NOTICE 타입에서는 빈 상태일 수 있습니다.
                tagList
        );
    }

    public BoardResponse entityToResponse(Board board) {

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
        List<Tag> tags = tagService.addTag(tagNames);
        List<BoardTag> boardTags = tags.stream()
                .map(tag -> new BoardTag(null, null, tag))
                .collect(Collectors.toList());

        // NOTICE,EVENT 타입 게시글일 경우 미디어 리스트를 초기화하지 않음
        List<MediaBoard> mediaBoards = new ArrayList<>();
        if (dto.getType() != BoardType.NOTICE && dto.getType() != BoardType.EVENT) {
            String[] categories = dto.getCategories();
            String[] mediaNames = dto.getMediaNames();
            for (int i = 0; i < mediaNames.length; i++) {
                Media media = mediaRepository.findByOwnerAndCategoryAndName(user, categories[i], mediaNames[i]);
                mediaBoards.add(new MediaBoard(null, media, null));
            }
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

    // 게시글을 추가하는 메소드
    @Transactional
    public BoardResponse addBoard(BoardRequest dto) {
        User user = userService.findById(dto.getWriterId());

        if (user.getUserType() != UserType.ADMIN && dto.getType() == BoardType.EVENT) {
            List<String> adminEventTags = eventService.getAdminEventTags();
            eventService.validateEventTags(dto, adminEventTags);
        }

        Board saved = boardRepository.save(requestToEntity(dto));

        // 게시글 타입이 공지사항,이벤트가 아니면 미디어 저장
        if (saved.getType() != BoardType.NOTICE && saved.getType() != BoardType.EVENT) {
            mediaBoardRepository.saveAll(saved.getMedia());
        }
        // 모든 게시글에 대해 태그 저장
        boardTagRepository.saveAll(saved.getTags());

        return entityToResponse(saved);
    }


    // 게시글 종류별로 전체 불러오기(추가로 블랙리스트 된 유저들의 게시글들은 필터링 되어서 숨김처리)
    public Page<BoardPreviewResponse> findAllByBoardType(BoardType boardType, int page, int size, String sortValue, String sortOrder, Principal principal) throws Exception {
        Sort sort = Sort.by(sortValue);

        if ("desc".equalsIgnoreCase(sortOrder)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        User user = userRepository.findById(principal.getName()).orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        List<Black> blacklistedUser = blackService.getBlackUser();
        List<String> blacklistedUserIds = blacklistedUser.stream()
                .map(black -> black.getBlackUser().getId())
                .collect(Collectors.toList());

        List<FriendDTO> friendships = friendshipService.findFriendsByUserEmail(user.getEmail());
        List<String> friendUserIds = friendships.stream()
                .map(FriendDTO::getFriendName)
                .collect(Collectors.toList());

        List<CloseFriendResponse> closeFriends = closeFriendService.getAddedByCloseFriends(user.getId());
        List<String> closeFriendUserIds = closeFriends.stream()
                .map(CloseFriendResponse::getUserId)
                .collect(Collectors.toList());

        List<LookedBoard> lookedBoards = lookedBoardRepository.findByUser(user);
        List<Long> lookedBoardIds = lookedBoards.stream()
                .map(lookedBoard -> lookedBoard.getBoard().getId())
                .collect(Collectors.toList());

        List<Board> allBoards;

        if (user.getUserType() == UserType.ADMIN) {
            // 관리자는 모든 게시글을 필터링 없이 가져옵니다.
            allBoards = boardRepository.findByType(boardType, sort).stream()
                    .filter(board -> !blacklistedUserIds.contains(board.getWriter().getId()))
                    .collect(Collectors.toList());
        } else {
            // 관리자가 아닌 경우 기존의 필터링 조건 사용
            allBoards = boardRepository.findByType(boardType, sort).stream()
                    .filter(board -> !blacklistedUserIds.contains(board.getWriter().getId()))
                    .filter(board -> board.getShare() == BoardShare.PUBLIC ||
                            (board.getShare() == BoardShare.FRIEND && (friendUserIds.contains(board.getWriter().getId()) || board.getWriter().getId().equals(user.getId()))) ||
                            (board.getShare() == BoardShare.CLOSE_FRIEND && (closeFriendUserIds.contains(board.getWriter().getId()) || board.getWriter().getId().equals(user.getId()))) ||
                            (board.getShare() == BoardShare.PRIVATE && board.getWriter().getId().equals(user.getId())) || board.getWriter().getId().equals(user.getId()))
                    .collect(Collectors.toList());
        }

        // 필터링된 게시글에서 한번도 보지 않았던 게시글들을 상위에 추가
        List<BoardPreviewResponse> newBoards = allBoards.stream()
                .filter(board -> !lookedBoardIds.contains(board.getId()))
                .map(this::entityToPreviewResponse)
                .collect(Collectors.toList());

        // 필터링된 게시글들 중 이미 본 게시글을 아래에 추가(가장 최근에 봤던 게시글이 가장 아래로 내려감)
        List<BoardPreviewResponse> seenBoards = lookedBoards.stream()
                .filter(lookedBoard -> lookedBoard.getBoard().getType() == boardType) // 게시글 타입 필터링 추가
                .sorted(Comparator.comparing(LookedBoard::getDate))
                .map(lookedBoard -> entityToPreviewResponse(lookedBoard.getBoard()))
                .collect(Collectors.toList());

        List<BoardPreviewResponse> sortedBoards = new ArrayList<>();
        sortedBoards.addAll(newBoards);
        sortedBoards.addAll(seenBoards);

        // 필터링된 결과를 기반으로 새롭게 페이지 객체를 만듭니다.
        int start = Math.min((int)pageable.getOffset(), sortedBoards.size());
        int end = Math.min((start + pageable.getPageSize()), sortedBoards.size());
        List<BoardPreviewResponse> paginatedBoards = sortedBoards.subList(start, end);

        return new PageImpl<>(paginatedBoards, pageable, allBoards.size());
    }

    // 전체 게시글(종류 상관없이)
    public List<BoardPreviewResponse> findAll(String sortType, boolean isDesc) {
        return boardRepository.findAll().stream()
                .map(this::entityToPreviewResponse)
                .collect(Collectors.toList());
    }

    public BoardResponse findById(Long id) {
        return entityToResponse(boardRepository.findById(id).orElse(null));
    }

    // 게시글 수정(제목, 내용, 태그)
    @Transactional
    public BoardResponse updateBoard(Long id, BoardRequest dto) {
        Optional<Board> optionalBoard = boardRepository.findById(id);

        if (!optionalBoard.isPresent()) {
            throw new IllegalArgumentException("해당 게시글을 찾을 수 없습니다: " + id);
        }

        Board board = optionalBoard.get();
        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());

        // 기존의 모든 태그를 삭제
        if (!board.getTags().isEmpty()) {
            boardTagRepository.deleteAll(board.getTags()); // 기존 태그 연결을 데이터베이스에서 삭제
            board.getTags().clear(); // 연관 관계를 메모리에서도 클리어
        }

        // 새 태그 처리
        Arrays.stream(dto.getTags().split("[#@]"))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .forEach(tagName -> {
                    Tag tag = tagRepository.findByName(tagName)
                            .orElseGet(() -> {
                                Tag newTag = new Tag(null, tagName);
                                tagRepository.save(newTag); // 새 태그 저장
                                return newTag;
                            });
                    board.getTags().add(new BoardTag(null, board, tag));
                });

        boardRepository.save(board); // 게시글 업데이트 (태그 포함)
        return entityToResponse(board);
    }

    @Transactional
    public void deleteBoard(Long id, String userId) throws IOException {
        Optional<Board> board = boardRepository.findById(id);
        User user = userService.findById(userId);
        if (board.isPresent() && board.get().getWriter().getId().equals(userId) || user.getUserType() == UserType.ADMIN) {
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
            throw new IllegalArgumentException("작성자와 관리자만 게시글을 삭제할 수 있습니다.");
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
            boardList = boardRepository.searchByTag(tagKeyword);
        } else {
            // 기본 검색 로직 (제목만 검색)
            boardList = boardRepository.searchByTitle(keyword);
        }
        return boardList.stream()
                .map(this::entityToPreviewResponse)
                .collect(Collectors.toList());
    }

    // 조회수 증가(사용자가 해당 게시글 클릭 시), 게시물 상세 보기 시 해당 유저의 이미 본 게시글로 등록
    @Transactional
    public Board updateVisit(Board board, User user) {
        if (board != null) {
            board.setView(board.getView() + 1);
            boardRepository.save(board);

            // 이미 본 게시글 테이블에 등록된 게시글이면 본 시간만 업데이트해서 저장
            LookedBoard lookedBoard = lookedBoardRepository.findByUserAndBoard(user, board)
                    .orElseGet(() -> new LookedBoard(null, LocalDateTime.now(), user, board)); // 최초로 볼 떄
            lookedBoard.setDate(LocalDateTime.now()); // 이미 본 게시글을 다시 볼 때 시간만 갱신
            lookedBoardRepository.save(lookedBoard);
        }
        return board;
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

    // 사용자(내가) 좋아요 누른 게시글 가져오기
    public List<Board> BoardsLikedByUser(User user) {
        List<LikedBoard> likeBoards = likeRepository.findByUser(user);
        return likeBoards.stream().map(LikedBoard::getBoard).collect(Collectors.toList());
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
    // 사용자가 북마크한 게시판 가져오기
    public List<Board> getBoardsBookmarkedByUser(User user) {
        List<BookmarkedBoard> bookmarkedBoards = bookMarkRepository.findByUser(user);
        return bookmarkedBoards.stream()
                .map(BookmarkedBoard::getBoard)
                .filter(board -> !board.getWriter().equals(user)) // 자기 자신이 쓴글 제외
                .collect(Collectors.toList());
    }

}