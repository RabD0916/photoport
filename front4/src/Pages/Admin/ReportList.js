import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./BoardCss/BlackList.scss";

const ReportList = () => {
    const [reports, setReports] = useState([]);
    const [selectedUserPosts, setSelectedUserPosts] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/blacklist/reports", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    const fetchUserPosts = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/board/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setSelectedUserPosts(response.data);
            setSelectedUserId(userId);
            setIsDetailOpen(true);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }
    };

    const handleBlacklist = async (userId) => {
        try {
            const response = await axios.post(`http://localhost:8080/api/blacklist/accept/${userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            alert(response.data.message || "블랙리스트에 추가되었습니다.");
            fetchReports(); // 블랙리스트 추가 후 신고 목록 갱신
        } catch (error) {
            console.error("Error adding to blacklist:", error);
        }
    };

    const handleReject = async (reportId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/blacklist/reject/${reportId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            alert(response.data || "신고가 반송 처리되었습니다.");
            fetchReports(); // 신고 반송 후 신고 목록 갱신
        } catch (error) {
            console.error("Error rejecting report:", error);
        }
    };

    return (
        <div className="blacklist-container">
            <h1>신고받은 내역</h1>
            <ul className="report-list">
                {reports.map(report => (
                    <li key={report.id} className="report-item">
                        <p>작성자 ID: {report.writerId}</p>
                        <p>신고 사유: {report.reason}</p>
                        <button onClick={() => fetchUserPosts(report.writerId)}>게시글 보기</button>
                        <button onClick={() => handleBlacklist(report.writerId)}>블랙리스트 추가</button>
                        <button onClick={() => handleReject(report.id)}>반송</button>
                    </li>
                ))}
            </ul>

            {isDetailOpen && selectedUserId && (
                <div className="user-posts">
                    <h2>작성자 {selectedUserId}의 게시글</h2>
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

export default ReportList;
