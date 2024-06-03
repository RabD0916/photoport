package com.example.webphoto.service;

import com.example.webphoto.domain.Alarm;
import com.example.webphoto.domain.Board;
import com.example.webphoto.domain.LikedBoard;
import com.example.webphoto.domain.User;
import com.example.webphoto.domain.enums.AlarmType;
import com.example.webphoto.dto.AlarmResponse;
import com.example.webphoto.repository.AlarmRepository;
import com.example.webphoto.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlarmService {

    private final AlarmRepository alarmRepository;
    private final UserRepository userRepository;

    @Transactional
    public void createTagAlarm(String userId, Board board) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));

        Alarm alarm = Alarm.builder()
                .content(board.getTitle() + " 에서 당신을 태그했습니다.")
                .date(LocalDateTime.now())
                .user(user)
                .board(board)
                .type(AlarmType.TAGGED)
                .build();

        alarmRepository.save(alarm);
    }

    public List<AlarmResponse> getAlarms(String userId) {
        List<Alarm> alarms = alarmRepository.findByUserIdAndType(userId, AlarmType.TAGGED);
        return alarms.stream()
                .map(alarm -> new AlarmResponse(
                        alarm.getId(),
                        alarm.getContent(),
                        alarm.getDate(),
                        alarm.getBoard().getId(),
                        alarm.getBoard().getTitle()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAlarm(Long alarmId, String userId) {
        Alarm alarm = alarmRepository.findById(alarmId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 태그 알립입니다!"));

        if (!alarm.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("자기 자신의 알림만 삭제 할 수 있습니다");
        }
        alarmRepository.delete(alarm);
    }
}
