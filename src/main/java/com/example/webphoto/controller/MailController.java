package com.example.webphoto.controller;

import com.example.webphoto.email.EmailCheckDto;
import com.example.webphoto.email.EmailRequestDto;
import com.example.webphoto.email.MailSendService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MailController {
    private final MailSendService mailSendService;

    @PostMapping("/mailSend")
    public String mailSend(@RequestBody @Valid EmailRequestDto emailRequestDto) {
        System.out.println("이메일 인증 : " + emailRequestDto.getEmail());
        return mailSendService.joinEmail(emailRequestDto.getEmail());
    }

    @PostMapping("/mailauthCheck")
    public String AuthCheck(@RequestBody @Valid EmailCheckDto emailCheckDto) {
        Boolean Checked = mailSendService.CheckAuthNum(emailCheckDto.getEmail(), emailCheckDto.getAuthNum());
        if (Checked) {
            return "ok";
        } else {
            throw new NullPointerException("뭔가 잘못!");
        }
    }
}
