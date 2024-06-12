package com.example.webphoto.service;

import com.example.webphoto.domain.CloseFriend;
import com.example.webphoto.domain.User;
import com.example.webphoto.dto.CloseFriendRequest;
import com.example.webphoto.dto.CloseFriendResponse;
import com.example.webphoto.repository.CloseFriendRepository;
import com.example.webphoto.repository.FriendshipRepository;
import com.example.webphoto.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CloseFriendService {

    private final CloseFriendRepository closeFriendRepository;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;

    @Transactional
    public CloseFriendResponse addCloseFriend(CloseFriendRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        User friend = userRepository.findById(request.getFriendName())
                .orElseThrow(() -> new IllegalArgumentException("Invalid friend ID"));

        // 친구 관계 확인
        if (!friendshipRepository.existsByUsersAndFriendEmail(user, friend.getEmail()) && !friendshipRepository.existsByUsersAndFriendEmail(friend, user.getEmail())) {
            throw new IllegalStateException("Users are not friends");
        }

        // 이미 친한 친구인지 확인
        if (closeFriendRepository.existsByUserAndFriend(user, friend)) {
            throw new IllegalStateException("Already close friends");
        }

        CloseFriend closeFriend = CloseFriend.builder()
                .user(user)
                .friend(friend)
                .build();

        closeFriendRepository.save(closeFriend);

        return new CloseFriendResponse(user.getId(), friend.getId(), friend.getUserNick());
    }

    // 본인(유저)이 친한친구를 추가한 사람들 리스트 확인
    public List<CloseFriendResponse> getCloseFriends(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        return closeFriendRepository.findByUser(user).stream()
                .map(closeFriend -> new CloseFriendResponse(
                        closeFriend.getUser().getId(),
                        closeFriend.getFriend().getId(),
                        closeFriend.getFriend().getEmail()))
                .collect(Collectors.toList());
    }

    // 본인(유저)을 친한친구로 추가한 사람들 리스트 확인
    public List<CloseFriendResponse> getAddedByCloseFriends(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        return closeFriendRepository.findByFriend(user).stream()
                .map(closeFriend -> new CloseFriendResponse(
                        closeFriend.getUser().getId(),
                        closeFriend.getFriend().getId(),
                        closeFriend.getUser().getUserNick()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeCloseFriend(CloseFriendRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        User friend = userRepository.findById(request.getFriendName())
                .orElseThrow(() -> new IllegalArgumentException("Invalid friend ID"));

        CloseFriend closeFriend = closeFriendRepository.findByUserAndFriend(user, friend)
                .orElseThrow(() -> new IllegalArgumentException("No such close friend relationship"));
        closeFriendRepository.delete(closeFriend);
    }
}