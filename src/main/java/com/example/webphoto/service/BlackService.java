package com.example.webphoto.service;

import com.example.webphoto.domain.Black;
import com.example.webphoto.domain.User;
import com.example.webphoto.domain.enums.BlackType;
import com.example.webphoto.dto.BlackRequest;
import com.example.webphoto.dto.BlackResponse;
import com.example.webphoto.repository.BlackRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlackService {

    private final BlackRepository blackRepository;
    private final UserService userService;

    @Transactional
    public BlackResponse blackReceived(BlackRequest dto) { // 신고 처리 메소드
        User blackUser = userService.findById(dto.getWriterId());
        if (blackUser == null) {
            throw new IllegalArgumentException("해당 사용자를 찾을 수 없습니다.");
        }

        Black black = new Black(null, BlackType.WAITING, dto.getReason(), LocalDateTime.now(), blackUser);
        blackRepository.save(black);
        return new BlackResponse(black.getId(), black.getBlackType(), black.getReason(), black.getBlackUser().getId(),"성공적으로 신고가 접수되었습니다.");
    }

    @Transactional
    public BlackResponse blackUser(Long id) { // 관리자가 실제로 신고 내용을 보고 블랙리스트 등록
        Black blackUser = blackRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 블랙리스트 항목을 찾을 수 없습니다"));
        if (blackUser.getBlackType() == BlackType.ACCEPT) {
            throw new IllegalArgumentException("이미 블랙리스트에 등록된 사용자입니다.");
        }

        blackUser.setBlackType(BlackType.ACCEPT);
        Black result = blackRepository.save(blackUser);


        return new BlackResponse(id, result.getBlackType(), result.getReason(), result.getBlackUser().getId(),"가 블랙리스트에 등록되었습니다.");
    }

    public void unBlackUser(Long id) { // 관리자가 신고 내용 확인 후 신고 반송 처리(테이블에서도 삭제)
        Black blackUser = blackRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 블랙리스트 항목을 찾을 수 없습니다."));
        blackRepository.delete(blackUser);
    }

    // 블랙리스트 처리된 유저들 불러오기(상태가 ACCEPT)
    public List<Black> getBlackUser() {
        return blackRepository.findByBlackType(BlackType.ACCEPT);
    }
}
