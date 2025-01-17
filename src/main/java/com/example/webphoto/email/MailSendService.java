package com.example.webphoto.email;

import com.example.webphoto.controller.RedisUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class MailSendService {
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private RedisUtil redisUtil;
    private int authNumber;

    public void makeRandomNumber() {
        Random r = new Random();
        String randomNumber = "";
        for (int i = 0; i < 6; i++) {
            randomNumber += Integer.toString(r.nextInt(10));
        }
        authNumber = Integer.parseInt(randomNumber);
    }

    public boolean CheckAuthNum(String email,String authNum){
        if(redisUtil.getData(authNum)==null){
            return false;
        }
        else if(redisUtil.getData(authNum).equals(email)){
            return true;
        }
        else{
            return false;
        }
    }

    public String joinEmail(String email) {
        makeRandomNumber();
        String setFrom = "testyoungwoo1@gmail.com"; // email-config에 설정한 자신의 이메일 주소를 입력
        String toMail = email;
        String title = "회원 가입 인증 이메일 입니다."; // 이메일 제목
        String content =
                "<div style='font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;'>" +
                        "<h2 style='color: #333;'>포토포트를 방문해주셔서 감사합니다.</h2>" +
                        "<p style='color: #555;'>아래의 인증 번호를 회원가입 창에 입력해 주세요:</p>" +
                        "<div style='background-color: #f9f9f9; padding: 10px; border-left: 5px solid #007bff; margin: 20px 0;'>" +
                        "<strong style='font-size: 24px;'>" + authNumber + "</strong>" +
                        "</div>" +
                        "<p style='color: #555;'>인증번호를 제대로 입력해주세요.</p>" +
                        "</div>";
        mailSend(setFrom, toMail, title, content);
        return Integer.toString(authNumber);
    }

    //이메일을 전송합니다.
    public void mailSend(String setFrom, String toMail, String title, String content) {
        MimeMessage message = mailSender.createMimeMessage();//JavaMailSender 객체를 사용하여 MimeMessage 객체를 생성
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message,true,"utf-8");//이메일 메시지와 관련된 설정을 수행합니다.
            // true를 전달하여 multipart 형식의 메시지를 지원하고, "utf-8"을 전달하여 문자 인코딩을 설정
            helper.setFrom(setFrom);//이메일의 발신자 주소 설정
            helper.setTo(toMail);//이메일의 수신자 주소 설정
            helper.setSubject(title);//이메일의 제목을 설정
            helper.setText(content,true);//이메일의 내용 설정 두 번째 매개 변수에 true를 설정하여 html 설정으로한다.
            mailSender.send(message);
        } catch (MessagingException e) {//이메일 서버에 연결할 수 없거나, 잘못된 이메일 주소를 사용하거나, 인증 오류가 발생하는 등 오류
            // 이러한 경우 MessagingException이 발생
            e.printStackTrace();//e.printStackTrace()는 예외를 기본 오류 스트림에 출력하는 메서드
        }
        redisUtil.setDataExpire(Integer.toString(authNumber),toMail,60*5L);

    }
}
