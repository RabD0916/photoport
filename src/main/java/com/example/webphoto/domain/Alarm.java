package com.example.webphoto.domain;

import com.example.webphoto.domain.enums.AlarmType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "alarm_")
@AllArgsConstructor
@NoArgsConstructor
public class Alarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarm_id")
    private Long id;

    @Column(name = "alarm_content")
    private String content;

    @Column(name = "alarm_date")
    private LocalDateTime date;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "alarm_type")
    private AlarmType type;

    @Column(name = "alarm_looked")
    private boolean looked;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private User receiver;
}
