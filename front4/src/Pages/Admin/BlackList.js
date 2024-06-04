import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./BoardCss/BlackList.scss";

const BlackList = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [blacklist, setBlacklist] = useState([]);
    const [selectedUserPosts, setSelectedUserPosts] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchBlacklist();
    }, []);

    const fetchBlacklist = async () => {
        try {
            const response = await axios.get(`${SERVER_IP}/api/blacklist`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setBlacklist(response.data);
        } catch (error) {
            console.error("Error fetching blacklist:", error);
        }
    };

    const fetchUserPosts = async (blackUser) => {
        try {
            const response = await axios.get(`${SERVER_IP}/api/blackBoards/${blackUser}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setSelectedUserPosts(response.data);
            setSelectedUserId(blackUser);
            setIsDetailOpen(true);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }
    };
    const deleteblackUser = async (blackId) => {
        try {
            const response = await axios.delete(`${SERVER_IP}/api/reject/${blackId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            alert(response.data || "블랙리스트에서 삭제되었습니다.");
            fetchBlacklist(); // 신고 반송 후 신고 목록 갱신
        } catch (error) {
            console.error("Error rejecting report:", error);
        }
    };

    return (
        <div className="blacklist-container">
            <h1>블랙리스트</h1>
            <ul className="blacklist">
                {blacklist.map(user => (
                    <li key={user.id} className="blacklist-item">
                        <p>사용자 ID: {user.blackUser}</p>
                        <p>신고 사유: {user.reason}</p>
                        <button onClick={() => fetchUserPosts(user.blackUser)}>게시글 보기</button>
                        <button onClick={() => deleteblackUser(user.blackId)}>블랙리스트에서 삭제</button>
                    </li>
                ))}
            </ul>

            {isDetailOpen && selectedUserId && (
                <div className="user-posts">
                    <h2>사용자 {selectedUserId}의 게시글</h2>
                    <ul>
                        {selectedUserPosts.map(post => (
                            <li key={post.id}>
                                <p>제목: {post.title}</p>
                                <p>내용: {post.content}</p>
                                {/* 필요한 추가 필드들 */}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setIsDetailOpen(false)}>닫기</button>
                </div>
            )}
        </div>
    );
};

export default BlackList;
