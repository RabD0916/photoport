package com.example.webphoto.controller;

import com.example.webphoto.domain.User;
import com.example.webphoto.dto.AddUserResponse;
import com.example.webphoto.dto.NewPasswordRequest;
import com.example.webphoto.dto.NewPasswordResponse;
import com.example.webphoto.email.*;
import com.example.webphoto.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MailController {
    private final MailSendService mailSendService;
    private final UserService userService;

    @PostMapping("/mailSend")
    public EmailResponseDto mailSend(@RequestBody @Valid EmailRequestDto emailRequestDto) {
        String result = mailSendService.joinEmail(emailRequestDto.getEmail());
//        System.out.println("이메일 인증 : " + emailRequestDto.getEmail());
        return new EmailResponseDto(emailRequestDto.getEmail(), "성공", result);
    }

    // 아이디 찾기
    @PostMapping("/mailauthCheck")
    public EmailByFindIdDto AuthCheck(@RequestBody @Valid EmailCheckDto emailCheckDto) {
        Boolean Checked = mailSendService.CheckAuthNum(emailCheckDto.getEmail(), emailCheckDto.getAuthNum());
        if (Checked) {
            String username = userService.findUserIdByEmail(emailCheckDto.getEmail());
            return new EmailByFindIdDto(username, "성공!!");
        } else {
            throw new NullPointerException("뭔가 잘못!");
        }
    }

    // 이메일 인증 성공 시 패스워드 재설정 페이지로 이동하기 위한 컨트롤러
    @PostMapping("/newPw")
    public EmailByFindPwDto AuthCheckPw(@RequestBody @Valid EmailCheckDto emailCheckDto) {
        Boolean Checked = mailSendService.CheckAuthNum(emailCheckDto.getEmail(), emailCheckDto.getAuthNum());
        if (Checked) {
            return new EmailByFindPwDto("비밀번호 재설정 페이지로 이동합니다!");
        } else {
            throw new NullPointerException("뭔가 잘못");
        }
    }

    // 새로운 비밀번호 재설정
    @PostMapping("/newPwUpdate")
    public NewPasswordResponse newPw(@RequestBody NewPasswordRequest dto) {
        AddUserResponse user = userService.findByNewPw(dto.getId(), dto.getPassword());

        return new NewPasswordResponse(user.getMessage());
    }
}
