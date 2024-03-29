package com.example.webphoto.repository;

import com.example.webphoto.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    @Query("select u from User u where u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

}
