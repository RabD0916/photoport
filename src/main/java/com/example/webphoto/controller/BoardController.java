package com.example.webphoto.controller;

import com.example.webphoto.domain.Board;
import com.example.webphoto.dto.AddBoardRequest;
import com.example.webphoto.dto.AddBoardResponse;
import com.example.webphoto.dto.GetBoardPreviewResponse;
import com.example.webphoto.dto.GetBoardResponse;
import com.example.webphoto.repository.BoardRepository;
import com.example.webphoto.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BoardController {
    private final BoardService boardService;
    private final BoardRepository boardRepository;

    // 게시글 추가
    @PostMapping("/boards")
    public ResponseEntity<AddBoardResponse> addBoard(@RequestBody AddBoardRequest request) {
        // 파일 업로드 후 메모 추가
        System.out.println(request.getTitle());
        System.out.println(request.getContent());
        System.out.println(request.getTags());
        System.out.println(request.getCategories()[0] + "category");
        System.out.println(request.getMediaNames()[0] + "mediaName");
        System.out.println(request);
        AddBoardResponse response = boardService.addBoard(request);
        System.out.println(response);
        return ResponseEntity.ok(response);
//        boardService.addBoard(new AddBoardRequest(title, content, savedName, user.getName()));
//        return "작성 완료";
    }


    // 사용자가 작성한 게시글 전체 가져오기
    @GetMapping("/boards")
    public List<GetBoardPreviewResponse> getBoards() {
        System.out.println("findAll");
        return boardService.findAll();
    }
    // 내가(로그인한 유저) 작성한 게시글 전체 불러오기
    @GetMapping("/myBoards")
    public List<GetBoardResponse> getMyBoards(Principal user) {
        return boardService.getBoardByUser(user.getName());
    }

    // 게시글 조회 시 조회수 증가 기능 추가
    @GetMapping("/board/{id}")
    public GetBoardResponse getBoard(@PathVariable String id) {
        System.out.println(id);
        Board board = boardRepository.findById(Long.valueOf(id)).orElse(null); // 추가 코드
        Board updatedBoard = boardService.updateVisit(board); // 추가 코드

        return boardService.findById(updatedBoard.getId());
    }

    // 키워드로 게시물 검색해서 나온 결과(게시물) 불러오기
    @GetMapping("/keywordSearch")
    public List<GetBoardPreviewResponse> getKeywordSearch(@RequestParam(required = false)String keyword) throws Exception {
        return boardService.getBoardByKeyWord(keyword);
    }
    // 사용자가 작성한 게시글 수정하기
//    @PostMapping("/update/board/{id}")
//    public ResponseEntity<GetBoardResponse> updateBoard(
//            @PathVariable("id") Long id,
//            @RequestParam("title") String title,
//            @RequestParam("content") String content,
//            @RequestParam("file") MultipartFile file) {
//
//        String savedName = fileService.uploadFile(file);
//        AddBoardRequest request = new AddBoardRequest(title, content, savedName);
//        GetBoardResponse response = boardService.updateBoard(id, request);
//        return ResponseEntity.ok(response);
//    }

    // 사용자가 작성한 게시글 삭제하기
    @PostMapping("/delete/board/{id}")
    public String deleteBoard(@PathVariable("id") Long id) {
        boardService.deleteBoard(id);
        return "게시글 삭제 완료";
    }
}
