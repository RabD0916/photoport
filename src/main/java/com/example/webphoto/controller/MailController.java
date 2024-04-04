package com.example.webphoto.controller;

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
}
