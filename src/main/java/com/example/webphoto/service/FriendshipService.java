package com.example.webphoto.service;

import com.example.webphoto.domain.Friendship;
import com.example.webphoto.domain.FriendshipStatus;
import com.example.webphoto.domain.User;
import com.example.webphoto.dto.Friend.*;
import com.example.webphoto.dto.FriendshipBlockResponse;
import com.example.webphoto.dto.FriendshipUnblockResponse;
import com.example.webphoto.dto.UserSearchResult;
import com.example.webphoto.repository.CloseFriendRepository;
import com.example.webphoto.repository.FriendshipRepository;
import com.example.webphoto.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendshipService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final CloseFriendRepository closeFriendRepository;

    public FriendshipRequestResponse createFriendship(String toEmail, Principal user) throws Exception {

        // 현재 로그인 되어있는 사람(보내는 사람)
        User users = userService.findById(user.getName());
        String fromEmail = users.getEmail();

        // 자신에게 친구 요청을 보내는 경우 방지
        if (fromEmail.equals(toEmail)) {
            throw new Exception("자신에게는 친구 요청을 보낼 수 없습니다.");
        }

        // 유저 정보를 모두 가져옴
        User fromUser = userRepository.findByEmail(fromEmail).orElseThrow(() -> new Exception("회원 조회 실패"));
        User toUser = userRepository.findByEmail(toEmail).orElseThrow(() -> new Exception("회원 조회 실패"));

        // 이미 친구관계인지 확인
        boolean isAlreadyFriends = fromUser.getFriendshipList().stream()
                .anyMatch(friendship -> friendship.getFriendEmail().equals(toEmail) && friendship.getStatus().equals(FriendshipStatus.ACCEPT));
        if (isAlreadyFriends) {
            throw new Exception("이미 친구 관계입니다.");
        }

        // 이미 친구 요청을 보냈는지 확인
        boolean isAlreadyRequested = fromUser.getFriendshipList().stream()
                .anyMatch(friendship -> friendship.getFriendEmail().equals(toEmail) && friendship.getStatus().equals(FriendshipStatus.WAITING));
        if (isAlreadyRequested) {
            throw new Exception("이미 친구 요청을 보냈습니다.");
        }


        // 받는 사람측에 저장될 친구 요쳥
        Friendship friendshipFrom = Friendship.builder()
                .users(fromUser)
                .userEmail(fromEmail)
                .friendEmail(toEmail)
                .status(FriendshipStatus.WAITING)
                .isFrom(true)
                .build();

        // 보내는 사람측에 저장될 천구 요청
        Friendship friendshipTo = Friendship.builder()
                .users(toUser)
                .userEmail(toEmail)
                .friendEmail(fromEmail)
                .status(FriendshipStatus.WAITING)
                .isFrom(false)
                .build();

        // 각각의 유저 리스트에 저장
        fromUser.getFriendshipList().add(friendshipTo);
        toUser.getFriendshipList().add(friendshipFrom);

        // 저장을 먼저 하는 이유는, 그래도 서로의 친구요청 번호가 생성되기 때문
        Friendship savedFriendshipTo = friendshipRepository.save(friendshipTo);
        Friendship savedFriendshipFrom = friendshipRepository.save(friendshipFrom);

        // 매칭되는 친구요청의 아이디를 서로 저장한다
        savedFriendshipTo.setCounterpartId(savedFriendshipFrom.getFriendshipId());
        savedFriendshipFrom.setCounterpartId(savedFriendshipTo.getFriendshipId());

        // 다시 저장하여 counterpartId 업데이트
        friendshipRepository.save(savedFriendshipTo);
        friendshipRepository.save(savedFriendshipFrom);

        FriendshipRequestResponse responseDto = FriendshipRequestResponse.builder()
                .userEmail(fromEmail)
                .friendEmail(toEmail)
                .message("친구 요청 성공!")
                .build();

        return responseDto;
    }

    // 받은 요청 중, 아직 수락 되지 않은 요청들
    public WaitingFriendListResponse getWaitingFriendList(String email) throws Exception {
        // 현재 로그인한 유저의 정보를 불러온다
        User users = userRepository.findByEmail(email).orElseThrow(() -> new Exception("회원 조회 실패"));
        List<Friendship> friendshipList = users.getFriendshipList();
        // 조회된 결과 객체를 담을 Dto 리스트
        List<WaitingFriendList> result = new ArrayList<>();

        for (Friendship x : friendshipList) {
            // 보낸 요청 아니고, 수락 대기중인 요청
            if (!x.isFrom() && x.getStatus().equals(FriendshipStatus.WAITING)) {
                User friend = userRepository.findByEmail(x.getFriendEmail()).orElseThrow(() -> new Exception("회원 조회 실패"));
                WaitingFriendList dto = WaitingFriendList.builder()
                        .friendshipId(x.getCounterpartId())
                        .friendEmail(friend.getEmail())
                        .friendName(friend.getId())
                        .status(x.getStatus())
                        .build();
                result.add(dto);
            }
        }
        // 결과 반환
        WaitingFriendListResponse responseDto = new WaitingFriendListResponse();
        responseDto.setWaitingFriendRequests(result);
        return responseDto;
    }

    // 친구 요청 승인
    public FriendshipApprovalResponse approveFriendshipRequest(Long friendshipId) throws Exception {
        // 누를 친구 요청과 매칭되는 상대방 친구 요청 둘다 가져옴
        Friendship friendship = friendshipRepository.findById(friendshipId).orElseThrow(() -> new Exception("친구 요청 조회 실패"));
        Friendship counterFriendship = friendshipRepository.findById(friendship.getCounterpartId()).orElseThrow(() -> new Exception("친구 요청 조회 실패"));

        // 둘다 상태를 ACCEPT로 변경함
        friendship.acceptFriendshipRequest();
        counterFriendship.acceptFriendshipRequest();

        // 변경된 상태를 데이터베이스에 저장
        friendshipRepository.save(friendship);
        friendshipRepository.save(counterFriendship);

        FriendshipApprovalResponse responseDto = FriendshipApprovalResponse.builder()
                .friendshipId(friendshipId)
                .friendName(friendship.getUsers().getId())
                .status(FriendshipStatus.ACCEPT)
                .message("친구 요청이 성공적으로 승인되었습니다!")
                .build();

        return responseDto;
    }

    // 친구 요청 거절
    public FriendshipRejectionResponse rejectFriendshipRequest(Long friendshipId) throws Exception {
        // 누를 친구 요청과 매칭되는 상대방 친구 요청 둘 다 가져옴
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new Exception("친구 요청 조회 실패"));
        Friendship counterFriendship = friendshipRepository.findById(friendship.getCounterpartId())
                .orElseThrow(() -> new Exception("친구 요청 조회 실패"));

        // 이미 수락된 친구 요청을 거절하려는 경우 예외 처리
        if (friendship.getStatus().equals(FriendshipStatus.ACCEPT) || counterFriendship.getStatus().equals(FriendshipStatus.ACCEPT)) {
            throw new Exception("이미 수락된 친구 요청은 거절할 수 없습니다.");
        }

        // 데이터베이스에서 두 친구 요청 모두 삭제
        friendshipRepository.delete(friendship);
        friendshipRepository.delete(counterFriendship);

        FriendshipRejectionResponse responseDto = FriendshipRejectionResponse.builder()
                .friendshipId(friendshipId)
                .message("친구 요청이 거절되었습니다!")
                .build();

        return responseDto;
    }

    // 친구 목록
    public List<FriendDTO> findFriendsByUserEmail(String userEmail) throws Exception {
        // 유저 존재 여부 검증
        if (userRepository.findByEmail(userEmail) == null) {
            throw new Exception("해당 이메일을 가진 유저가 존재하지 않습니다: " + userEmail);
        }

        List<Friendship> results = friendshipRepository.findFriendsByUserIdNative(userEmail);
        List<FriendDTO> friends = new ArrayList<>();
        for (Friendship result : results) {
            Long friendId = result.getFriendshipId();
            Long friendshipId = result.getFriendshipId();
            String friendEmail = result.getUsers().getEmail();
            String friendName = result.getUsers().getId();

            friends.add(new FriendDTO(friendId, friendshipId, friendEmail, friendName));
        }
        return friends;
    }


    // 친구 삭제
    public FriendshipRemovalResponse removeFriendship(Long friendshipId) throws Exception {
        // 주어진 friendshipId로 친구 관계 정보를 조회
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new Exception("친구 관계 조회 실패"));

        // 매칭되는 상대방 친구 요청도 함께 가져옴
        Friendship counterFriendship = friendshipRepository.findById(friendship.getCounterpartId())
                .orElseThrow(() -> new Exception("친구 요청 조회 실패"));

        // 데이터베이스에서 두 친구 요청 모두 삭제
        friendshipRepository.delete(friendship);
        friendshipRepository.delete(counterFriendship);

        // 응답 객체 생성 및 반환
        FriendshipRemovalResponse responseDto = FriendshipRemovalResponse.builder()
                .friendshipId(friendshipId)
                .message("친구 관계가 성공적으로 해제되었습니다!")
                .build();

        return responseDto;
    }


    // 친구 차단
    public FriendshipBlockResponse blockFriendship(Long friendshipId) throws Exception {
        // 주어진 friendshipId로 친구 관계 정보를 조회
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new Exception("친구 관계 조회 실패"));

        // 매칭되는 상대방 친구 요청도 함께 가져옴
        Friendship counterFriendship = friendshipRepository.findById(friendship.getCounterpartId())
                .orElseThrow(() -> new Exception("친구 요청 조회 실패"));

        // 친한 친구 관계인지 확인
        User user = friendship.getUsers();
        User friend = userRepository.findByEmail(friendship.getFriendEmail())
                .orElseThrow(() -> new Exception("친구 정보 조회 실패"));
        if (closeFriendRepository.existsByUserAndFriend(user, friend)) {
            throw new Exception("친한 친구 관계를 먼저 해제해야 합니다.");
        }

        // 친구 상태를 BLOCKED로 변경
        friendship.setStatus(FriendshipStatus.BLOCKED);
        counterFriendship.setStatus(FriendshipStatus.BLOCKED);

        // 변경된 상태를 데이터베이스에 저장
        friendshipRepository.save(friendship);
        friendshipRepository.save(counterFriendship);

        // 응답 객체 생성 및 반환
        FriendshipBlockResponse responseDto = FriendshipBlockResponse.builder()
                .friendshipId(friendshipId)
                .message("친구를 차단했습니다!")
                .build();

        return responseDto;
    }

    // 친구 차단 해제
    public FriendshipUnblockResponse unblockFriendship(Long friendshipId) throws Exception {
        // 주어진 friendshipId로 친구 관계 정보를 조회
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new Exception("친구 관계 조회 실패"));

        // 매칭되는 상대방 친구 요청도 함께 가져옴
        Friendship counterFriendship = friendshipRepository.findById(friendship.getCounterpartId())
                .orElseThrow(() -> new Exception("친구 요청 조회 실패"));

        // 데이터베이스에서 두 친구 요청 모두 삭제
        friendshipRepository.delete(friendship);
        friendshipRepository.delete(counterFriendship);

        // 응답 객체 생성 및 반환
        FriendshipUnblockResponse responseDto = FriendshipUnblockResponse.builder()
                .friendshipId(friendshipId)
                .message("친구 차단이 해제되었습니다!")
                .build();

        return responseDto;
    }

    // 차단된 친구 목록 조회
    public List<FriendDTO> getBlockedFriends(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));

        List<Friendship> blockedFriendships = friendshipRepository.findByUsersAndStatus(user, FriendshipStatus.BLOCKED);
        return blockedFriendships.stream()
                .map(friendship -> new FriendDTO(
                        friendship.getFriendshipId(),
                        friendship.getCounterpartId(),
                        friendship.getFriendEmail(),
                        userRepository.findByEmail(friendship.getFriendEmail()).orElseThrow(() -> new IllegalArgumentException("친구 정보를 찾을 수 없습니다.")).getUserNick()
                ))
                .collect(Collectors.toList());
    }

}
