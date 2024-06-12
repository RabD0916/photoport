package com.example.webphoto.repository;

import com.example.webphoto.domain.Friendship;
import com.example.webphoto.domain.FriendshipStatus;
import com.example.webphoto.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    // user(본인)의 친구들 조회
    @Query(value = "SELECT * FROM friendship WHERE friend_email = :userEmail AND status = 0", nativeQuery = true)
    List<Friendship> findFriendsByUserIdNative(@Param("userEmail") String userEmail);

    boolean existsByUsersAndFriendEmail(User users, String friendEmail);

    // 사용자와 상태로 친구 찾기
    List<Friendship> findByUsersAndStatus(User users, FriendshipStatus status);


    List<Friendship> findByUserEmailAndStatus(String userEmail, FriendshipStatus status);
}