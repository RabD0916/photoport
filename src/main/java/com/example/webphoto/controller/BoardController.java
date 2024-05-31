package com.example.webphoto.controller;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.User;
import com.example.webphoto.domain.enums.BoardType;
import com.example.webphoto.dto.BoardRequest;
import com.example.webphoto.dto.BoardPreviewResponse;
import com.example.webphoto.dto.BoardResponse;
import com.example.webphoto.dto.SortRequest;
import com.example.webphoto.repository.BoardRepository;
import com.example.webphoto.service.BoardService;
import com.example.webphoto.service.EventService;
import com.example.webphoto.service.MediaService;
import com.example.webphoto.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api" )
public class BoardController {
    private final BoardService boardService;
    private final BoardRepository boardRepository;
    private final UserService userService;
    private final MediaService mediaService;
    private final EventService eventService;

    // 공통 게시글 추가 로직
    private ResponseEntity<BoardResponse> addBoardCommon(Principal userId, BoardRequest dto, List<MultipartFile> files) {
        // 공지사항 게시글이면 파일 처리 X
        if (dto.getType() != BoardType.NOTICE && files != null && !files.isEmpty()) {
            String path = "./front4/public/images/";
            String dir = path + userId.getName() + "/pose";
            File folder = new File(dir);


            if (!folder.exists() && !folder.mkdirs()) {
                return ResponseEntity.internalServerError().body(new BoardResponse(null, dto.getTitle(), null, dto.getContent(), 0, 0, 0,dto.getType(), dto.getWriterId(), null, null, null, null));
            }

            for (MultipartFile file : files) {
                try {
                    Path filePath = Paths.get(folder.getAbsolutePath() + "/" + file.getOriginalFilename());

                    // 파일 이름 중복 확인
                    if (Files.exists(filePath)) {
                        // 중복되는 경우 예외 처리
                        return ResponseEntity.badRequest().body(new BoardResponse(null, "File name already exists: " + file.getOriginalFilename(), null, null, 0, 0, 0, null,null, null, null, null, null));
                    }

                    Files.write(filePath, file.getBytes());
                    String fileURL = file.getOriginalFilename();
                    mediaService.addPose(userId.getName(), fileURL);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        BoardResponse response = boardService.addBoard(dto);
        return ResponseEntity.ok(response);
    }

    // 포즈 추천 게시글 등록
    @PostMapping("/poseBoard")
    public ResponseEntity<BoardResponse> addPoseBoard(Principal userId, @RequestPart(value = "dto") BoardRequest dto, @RequestPart("files") List<MultipartFile> files) {
        System.out.println(userId);
        System.out.println(dto);
        System.out.println(files);
        return addBoardCommon(userId, dto, files);
    }

    // 공유 게시글 추가
    @PostMapping("/normalBoard")
    public ResponseEntity<BoardResponse> addNormalBoard(@RequestBody BoardRequest dto, Principal userId) {
        return addBoardCommon(userId, dto, null);
    }

    // 관리자 게시글 추가
    @PostMapping("/adminBoard")
    public ResponseEntity<BoardResponse> addAdminBoard(@RequestBody BoardRequest dto, Principal adminId) {
        return addBoardCommon(adminId, dto, null);
    }

    // 이벤트 게시글 추가
    @PostMapping("/eventBoard")
    public ResponseEntity<BoardResponse> addEventBoard(@RequestBody BoardRequest dto, Principal principal) {
        return addBoardCommon(principal, dto, null);
    }


    // 이벤트 게시글 불러오기(이벤트에 참여한 게시글들을 불러와서 당첨자 고를때 사용?..)
    @GetMapping("/eventBoards")
    public ResponseEntity<List<BoardResponse>> getEventBoards() {
        List<BoardResponse> participationPosts = eventService.getEventBoards();
        return ResponseEntity.ok(participationPosts);
    }


    // 사용자가 작성한 게시글 전체 가져오기
    @GetMapping("/boards")
    public List<BoardPreviewResponse> getBoards() {
        System.out.println("findAll");
        return boardService.findAll("view", false);
    }

    // 게시글 종류별로 전체 불러오기(블랙리스트에 등록된 유저의 게시글은 안나옴 그대로 사용하면 됨, 공개 범위, 이미 본 게시글 필터 추가)
    @GetMapping("/type/{boardType}")
    public ResponseEntity<Page<BoardPreviewResponse>> getBoardsByType(
            @PathVariable("boardType") String boardType,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortValue", defaultValue = "createdAt") String sortValue,
            @RequestParam(value = "sortOrder", defaultValue = "desc") String sortOrder,
            Principal principal) throws Exception {

        Page<BoardPreviewResponse> responses = boardService.findAllByBoardType(BoardType.valueOf(boardType.toUpperCase()), page, size, sortValue, sortOrder, principal);
        return ResponseEntity.ok(responses);
    }


    // 내가(로그인한 유저) 작성한 게시글 전체 불러오기
    @GetMapping("/myBoards")
    public List<BoardResponse> getMyBoards(Principal user) {
        return boardService.getBoardByUser(user.getName());
    }

    // 특정 유저(ex 블랙리스트 유저 등) 게시글 불러오기
    @GetMapping("/blackBoards/{blackUser}")
    public List<BoardResponse> getBlackBoards(@PathVariable String blackUser) {
        return boardService.getBoardByUser(blackUser);
    }

    // 게시글 조회 시 조회수 증가 기능 추가
    @GetMapping("/board/{id}")
    public BoardResponse getBoard(@PathVariable String id, Principal principal) {
        System.out.println(id);
        User user = userService.findById(principal.getName());
        Board board = boardRepository.findById(Long.valueOf(id)).orElse(null);
        Board updatedBoard = boardService.updateVisit(board, user);

        return boardService.findById(updatedBoard.getId());
    }

    // 게시물 좋아요
    @PostMapping("/like/{id}")
    public ResponseEntity<BoardResponse> like(@PathVariable Long id, Principal user) {
            User target = userService.findById(user.getName());
            Board updateBoard = boardService.addLike(id, target);

            BoardResponse response = boardService.findById(updateBoard.getId());
            return ResponseEntity.ok(response);
    }

    // 좋아요한 게시판 가져오기
    @GetMapping("/likedBoards")
    public ResponseEntity<List<BoardResponse>> getLikedBoards(Principal user) {
        User target = userService.findById(user.getName());
        List<Board> boards = boardService.BoardsLikedByUser(target);
        List<BoardResponse> responses = boards.stream().map(boardService::entityToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }


    // 게시물 북마크
    @PostMapping("/bookmark/{id}")
    public ResponseEntity<BoardResponse> bookmark(@PathVariable Long id, Principal user) {
        User target = userService.findById(user.getName());
        Board updateBoard = boardService.addBookmark(id, target);

        BoardResponse response = boardService.findById(updateBoard.getId());
        return ResponseEntity.ok(response);
    }

    // 북마크한 게시판 가져오기
    @GetMapping("/bookmarkedBoards")
    public ResponseEntity<List<BoardResponse>> getBookmarkedBoards(Principal user) {
        User target = userService.findById(user.getName());
        List<Board> boards = boardService.getBoardsBookmarkedByUser(target);
        List<BoardResponse> responses = boards.stream().map(boardService::entityToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 키워드로 게시물 검색해서 나온 결과(게시물) 불러오기

    @GetMapping("/keywordSearch")
    public List<BoardPreviewResponse> getKeywordSearch(@RequestParam(required = false)String keyword) throws Exception {
        return boardService.getBoardByKeyWord(keyword);
    }

    // 사용자가 작성한 게시글 수정하기(아직 미완인듯.. 사진 수정해야되면 로직 바꿔야함)
    @PostMapping("/update/board/{id}")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable("id") Long id, @RequestBody BoardRequest dto) {

        BoardResponse response = boardService.updateBoard(id, dto);

        return ResponseEntity.ok(response);
    }

    // 사용자가 작성한 게시글 삭제하기
    @DeleteMapping("/delete/board/{id}")
    public String deleteBoard(@PathVariable("id") Long id, Principal user) throws IOException {
        boardService.deleteBoard(id, user.getName());
        return "Success deleted";
    }
}
