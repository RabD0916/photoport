package com.example.webphoto.repository;

import com.example.webphoto.domain.CloseFriend;
import com.example.webphoto.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CloseFriendRepository extends JpaRepository<CloseFriend, Long> {
    List<CloseFriend> findByUser(User user);
    Optional<CloseFriend> findByUserAndFriend(User user, User friend);
    boolean existsByUserAndFriend(User user, User friend);
    List<CloseFriend> findByFriend(User friend);
}
