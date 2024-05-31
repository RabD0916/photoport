package com.example.webphoto.repository;

import com.example.webphoto.domain.Friendship;
import com.example.webphoto.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    // user(본인)의 친구들 조회
    @Query(value = "SELECT * FROM friendship WHERE friend_email = :userEmail AND status = 0", nativeQuery = true)
    List<Friendship> findFriendsByUserIdNative(@Param("userEmail") String userEmail);

    boolean existsByUsersAndFriendEmail(User users, String friendEmail);
}