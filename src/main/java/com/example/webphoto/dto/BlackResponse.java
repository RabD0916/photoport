package com.example.webphoto.dto;

import com.example.webphoto.domain.User;
import com.example.webphoto.domain.enums.BlackType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class BlackResponse {

    private Long blackId; // 신고 접수 아이디

    private BlackType blackType; // 신고 상태

    private String reason; // 신고 내용

    private String blackUser; // 신고 접수된 유저 아이디

    private String message; // ex) 신고 처리가 성공적으로 접수 되었습니다.

    public BlackResponse(Long blackId, BlackType blackType, String reason, String blackUser) {
        this.blackId = blackId;
        this.blackType = blackType;
        this.reason = reason;
        this.blackUser = blackUser;
    }
}
