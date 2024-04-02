package com.example.webphoto.controller;

import com.example.webphoto.dto.*;
import com.example.webphoto.service.BoardService;
import com.example.webphoto.service.FileService;
import com.example.webphoto.service.TokenService;
import com.example.webphoto.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ApiController {

    private final UserService userService;
    private final TokenService tokenService;
    private final BoardService boardService;
    private final FileService fileService;


    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<AddUserResponse> AddUser(@RequestBody AddUserRequest dto) {
        AddUserResponse response = userService.addUser(dto);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response); // 성공한 응답
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); // 실패한 응답
        }
    }

    // 로그인
    @PostMapping("/signin")
    public ResponseEntity<CreateAccessTokenResponse> postSignin(
            @RequestBody CreateAccessTokenRequest request) {
        try {
            CreateAccessTokenResponse response = tokenService.createAccessToken(request);
            return ResponseEntity.ok(response);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(null);
        }
    }



    // ?? 이건 잘 모름
    @PostMapping("/token")
    public ResponseEntity<CreateAccessTokenResponse> postToken(
            @RequestBody CreateAccessTokenRequest request
    ){

        try {
            CreateAccessTokenResponse response = tokenService.createAccessToken(request);
            return ResponseEntity.ok(response);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(null);
        }
    }


    // 회원정보 수정
    @PostMapping("/update")
    public ResponseEntity<AddUserResponse> updateUser(Principal user, @RequestBody AddUserRequest dto) {
        AddUserResponse updateUser = userService.updateUser(user.getName(), dto);
        return ResponseEntity.ok(updateUser);
    }


    // 회원 삭제
    @PostMapping("/delete")
    public String deleteUser(Principal user) {
        userService.deleteUser(user.getName());
        return "회원 탈퇴";
    }

    // 게시글 추가
    @PostMapping("/boards")
    public ResponseEntity<AddBoardResponse> addBoard(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("file") MultipartFile file,
            Principal user) {
        // 파일 업로드 후 메모 추가
        String savedName = fileService.uploadFile(file);
        AddBoardRequest request = new AddBoardRequest(title, content, savedName, user.getName());
        AddBoardResponse response = boardService.addBoard(request);
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
