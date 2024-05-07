package com.example.webphoto.repository;

import com.example.webphoto.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    @Query("select u from User u where u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    // 닉네임으로 해당 유저 찾기
    @Query("select u from User u where u.userNick = :userNick")
    Optional<User> findByUserNick(@Param("userNick") String userNick);

    // 친구 추가를 위한 검색
    @Query("SELECT u FROM User u WHERE u.email LIKE CONCAT(:email, '%')")
    List<User> findByEmailStartingWith(@Param("email") String email);
}
