package com.example.webphoto.controller;

import com.example.webphoto.dto.AddBoardRequest;
import com.example.webphoto.dto.AddBoardResponse;
import com.example.webphoto.dto.GetBoardResponse;
import com.example.webphoto.service.BoardService;
import com.example.webphoto.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BoardController {
    private final BoardService boardService;
    private final FileService fileService;

    // 게시글 추가
    @PostMapping("/boards")
    public ResponseEntity<AddBoardResponse> addBoard(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("url") String[] urls,
            Principal user) {
        // 파일 업로드 후 메모 추가
        System.out.println(user.getName());
        System.out.println(title);
        System.out.println(content);
        System.out.println(urls[0]);
        AddBoardRequest request = new AddBoardRequest(title, content, user.getName());
        AddBoardResponse response = boardService.addBoard(request, urls);
        return ResponseEntity.ok(response);
//        boardService.addBoard(new AddBoardRequest(title, content, savedName, user.getName()));
//        return "작성 완료";
    }


    // 사용자가 작성한 게시글 전체 가져오기
    @GetMapping("/boards")
    public List<GetBoardResponse> getBoards(Principal user) {
        return boardService.getBoardByUser(user.getName());
    }

    // 사용자가 작성한 게시글 수정하기
    @PostMapping("/update/board/{id}")
    public ResponseEntity<GetBoardResponse> updateBoard(
            @PathVariable("id") Long id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("file") MultipartFile file) {

        String savedName = fileService.uploadFile(file);
        AddBoardRequest request = new AddBoardRequest(title, content, savedName);
        GetBoardResponse response = boardService.updateBoard(id, request);
        return ResponseEntity.ok(response);
    }

    // 사용자가 작성한 게시글 삭제하기
    @PostMapping("/delete/board/{id}")
    public String deleteBoard(@PathVariable("id") Long id) {
        boardService.deleteBoard(id);
        return "게시글 삭제 완료";
    }
}
