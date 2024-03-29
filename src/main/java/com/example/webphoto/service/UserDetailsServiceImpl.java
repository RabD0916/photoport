package com.example.webphoto.service;

import com.example.webphoto.domain.User;
import com.example.webphoto.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.springframework.security.core.userdetails.User.withUsername;

@RequiredArgsConstructor
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> res = userRepository.findById(username);
        if(res.isEmpty()) {
            throw new UsernameNotFoundException("Invailid username");
        }
        User user = res.get();
        return withUsername(username)
                .password(user.getPassword())
                .build();
    }
}
