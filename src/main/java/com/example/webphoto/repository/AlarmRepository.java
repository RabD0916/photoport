package com.example.webphoto.repository;

import com.example.webphoto.domain.Alarm;
import com.example.webphoto.domain.enums.AlarmType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlarmRepository extends JpaRepository<Alarm, Long> {
    List<Alarm> findByUserIdAndType(String userId, AlarmType type);
}

