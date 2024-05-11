package com.example.webphoto.controller;

import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.User;
import com.example.webphoto.domain.enums.BoardType;
import com.example.webphoto.dto.BoardRequest;
import com.example.webphoto.dto.BoardPreviewResponse;
import com.example.webphoto.dto.BoardResponse;
import com.example.webphoto.repository.BoardRepository;
import com.example.webphoto.service.BoardService;
import com.example.webphoto.service.MediaService;
import com.example.webphoto.service.UserService;
import lombok.RequiredArgsConstructor;
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

@RestController
@RequiredArgsConstructor
@RequestMapping("/api" )
public class BoardController {
    private final BoardService boardService;
    private final BoardRepository boardRepository;
    private final UserService userService;
    private final MediaService mediaService;

    // 공통 게시글 추가 로직
    private ResponseEntity<BoardResponse> addBoardCommon(Principal userId, BoardRequest dto, List<MultipartFile> files) {
        if (files != null && !files.isEmpty()) {
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
        return addBoardCommon(userId, dto, files);
    }

    // 공유 게시글 추가
    @PostMapping("/normalBoard")
    public ResponseEntity<BoardResponse> addNormalBoard(@RequestBody BoardRequest dto, Principal userId) {
        return addBoardCommon(userId, dto, null);
    }

    // 관리자 게시글 추가
//    @PostMapping("/adminBoard")
//    public ResponseEntity<BoardResponse> addAdminBoard(@RequestBody BoardRequest dto, Principal adminId) {
//        return addBoardCommon(adminId, dto, null);
//    }


    // 사용자가 작성한 게시글 전체 가져오기
    @GetMapping("/boards")
    public List<BoardPreviewResponse> getBoards() {
        System.out.println("findAll");
        return boardService.findAll();
    }

    // 게시글 종류별로 전체 불러오기
    @GetMapping("/type/{boardType}")
    public List<BoardPreviewResponse> getBoardsByType(@PathVariable("boardType") BoardType boardType) {
        return boardService.findAllByBoardType(boardType);
    }


    // 내가(로그인한 유저) 작성한 게시글 전체 불러오기
    @GetMapping("/myBoards")
    public List<BoardResponse> getMyBoards(Principal user) {
        return boardService.getBoardByUser(user.getName());
    }

    // 게시글 조회 시 조회수 증가 기능 추가
    @GetMapping("/board/{id}")
    public BoardResponse getBoard(@PathVariable String id) {
        System.out.println(id);
        Board board = boardRepository.findById(Long.valueOf(id)).orElse(null); // 추가 코드
        Board updatedBoard = boardService.updateVisit(board); // 추가 코드

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

    // 게시물 북마크
    @PostMapping("/bookmark/{id}")
    public ResponseEntity<BoardResponse> bookmark(@PathVariable Long id, Principal user) {
        User target = userService.findById(user.getName());
        Board updateBoard = boardService.addBookmark(id, target);

        BoardResponse response = boardService.findById(updateBoard.getId());
        return ResponseEntity.ok(response);
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
