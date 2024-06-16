package com.example.webphoto.controller;

import com.example.webphoto.domain.Black;
import com.example.webphoto.dto.BlackRequest;
import com.example.webphoto.dto.BlackResponse;
import com.example.webphoto.service.BlackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BlackController {

    private final BlackService blackService;

    // 신고 접수
    @PostMapping("/report")
    public ResponseEntity<BlackResponse> report(@RequestBody BlackRequest blackRequest) {
        BlackResponse response = blackService.blackReceived(blackRequest);
        if (response != null) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(new BlackResponse(null, null, null, null, "신고 접수에 실패하였습니다."));
    }

    //  신고 접수를 받은 리스트 목록 가져오기
    @GetMapping("/reportUser")
    public ResponseEntity<List<BlackResponse>> getReportUser() {
        List<Black> reportUser = blackService.getReportUser();
        if (reportUser == null) {
            return ResponseEntity.badRequest().body(null);
        }
        List<BlackResponse> responses = reportUser.stream()
                .map(report -> new BlackResponse(report.getId(), report.getBlackType(), report.getReason(), report.getBlackUser().getId()))
                .toList();
        return ResponseEntity.ok(responses);
    }

    // 블랙리스트 등록 (관리자 권한 필요)
    @PostMapping("/accept/{id}")
    public ResponseEntity<BlackResponse> acceptReport(@PathVariable Long id) {
        BlackResponse response = blackService.blackUser(id);
        if (response != null) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(new BlackResponse(id, response.getBlackType(), response.getReason(), response.getBlackUser(), "블랙리스트 등록에 실패하였습니다."));
    }

    // 신고 반송 처리 및 블랙리스트에서 삭제 (관리자 권한 필요)
    @DeleteMapping("/reject/{id}")
    public ResponseEntity<String> rejectReport(@PathVariable Long id) {
        blackService.unBlackUser(id);
        return ResponseEntity.ok("신고가 반송 처리되었습니다.");
    }

    // 블랙리스트 유저들 가져오기
    @GetMapping("/blacklist")
    public ResponseEntity<List<BlackResponse>> getBlackList() {
        List<Black> blackList = blackService.getBlackUser();
        if (blackList == null) {
            return ResponseEntity.badRequest().body(null);
        }
        List<BlackResponse> responses = blackList.stream()
                .map(black -> new BlackResponse(black.getId(), black.getBlackType(), black.getReason(), black.getBlackUser().getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
