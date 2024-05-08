import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddFriendPage() {
    const accessToken = localStorage.getItem("accessToken");
    const [email, setEmail] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]); // 받은 친구 요청 목록 관리를 위한 state

    useEffect(() => {
        fetchReceivedRequests(); // 컴포넌트 마운트 시 받은 친구 요청을 불러옵니다.
    }, []);

    const handleSearchChange = (event) => {
        setEmail(event.target.value); // 검색창의 입력값을 관리합니다.
    };

    // 받은 친구 요청을 불러오는 함수
    const fetchReceivedRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/friends/received`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setReceivedRequests(response.data.waitingFriendRequests);

            if (response.status !== 200) {
                alert("친구를 찾을 수 없습니다. 다시 입력해 주세요.")
            }
        } catch (error) {
            console.error("받은 친구 요청을 불러오는 중 오류가 발생했습니다.", error);
        }
    };

    // 사용자 검색 처리 함수
    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/user/search`, {
                params: { email: email },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            setSearchResults(response.data); // 검색 결과를 업데이트합니다.
        } catch (error) {
            console.error("검색 중 오류가 발생했습니다.", error);
        }
    };

    // 친구 추가 요청 처리 함수
    const handleAddFriend = async (email) => {
        try {
            await axios.post(`http://localhost:8080/api/user/friends/${email}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            alert("친구 요청을 보냈습니다!");
        } catch (error) {
            console.error("친구 추가 중 오류가 발생했습니다.", error);
        }
    };

    // 친구 요청 수락 처리 함수
    const handleApprove = async (friendshipId) => {
        try {
            await axios.post(`http://localhost:8080/api/user/friends/approve/${friendshipId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            alert("친구 요청을 수락했습니다!");
            fetchReceivedRequests(); // 받은 요청 목록을 업데이트합니다.
        } catch (error) {
            console.error("친구 요청 수락 중 오류가 발생했습니다.", error);
        }
    };

    // 친구 요청 거절 처리 함수
    const handleReject = async (friendshipId) => {
        try {
            await axios.delete(`http://localhost:8080/api/user/friends/reject/${friendshipId}`,  {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            alert("친구 요청을 거절했습니다!");
            fetchReceivedRequests(); // 받은 요청 목록을 업데이트합니다.
        } catch (error) {
            console.error("친구 요청 거절 중 오류가 발생했습니다.", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="친구 검색..."
                value={email}
                onChange={handleSearchChange}
            />
            <button onClick={handleSearch}>검색</button>
            <ul>
                {searchResults.map((user) => (
                    <li key={user.id}>{user.userId} - {user.userNick} <button onClick={() => handleAddFriend(user.userEmail)}>친구 추가</button></li>
                ))}
            </ul>
            <h2>받은 친구 요청</h2>
            <ul>
                {receivedRequests.map((request) => (
                    <li key={request.friendshipId}>{request.friendEmail} - {request.friendName}
                        <button onClick={() => handleApprove(request.friendshipId)}>수락
                        </button>
                        <button onClick={() => handleReject(request.friendshipId)}>거절</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AddFriendPage;

