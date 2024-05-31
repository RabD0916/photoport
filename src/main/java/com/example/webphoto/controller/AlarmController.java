package com.example.webphoto.controller;

import com.example.webphoto.domain.Alarm;
import com.example.webphoto.dto.AlarmResponse;
import com.example.webphoto.repository.AlarmRepository;
import com.example.webphoto.service.AlarmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AlarmController {

    private final AlarmService alarmService;


    @GetMapping("/alarms")
    public ResponseEntity<List<AlarmResponse>> getAlarms(Principal user) {
        String userId = user.getName();
        List<AlarmResponse> alarms = alarmService.getAlarms(userId);
        return ResponseEntity.ok(alarms);
    }

    @DeleteMapping("/alarms/{alarmId}")
    public ResponseEntity<Void> deleteAlarm(@PathVariable Long alarmId, Principal user) {
        String userId = user.getName();
        alarmService.deleteAlarm(alarmId, userId);
        return ResponseEntity.noContent().build();
    }
}
