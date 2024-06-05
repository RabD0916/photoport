import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./BoardCss/BlackList.scss";

const ReportList = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [reports, setReports] = useState([]);
    const [selectedUserPosts, setSelectedUserPosts] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        getReports();
    }, []);

    //신고받은 리스트 보기
    const getReports = async () => {
        try {
            const response = await axios.get(`${SERVER_IP}/api/reportUser`, { //영우가 설정해 놓은 주소로 변경해야함
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };


    //신고당한 게시글 보기
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

    //블랙리스트 추가
    const handleBlacklist = async (blackId) => {
        try {
            const response = await axios.post(`${SERVER_IP}/api/accept/${blackId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            alert(response.data.message || `${blackId}블랙리스트에 추가되었습니다.`);
            getReports(); // 블랙리스트 추가 후 신고 목록 갱신
        } catch (error) {
            console.error("Error adding to blacklist:", error);
        }
    };

    //반송
    const handleReject = async (blackId) => {
        try {
            const response = await axios.delete(`${SERVER_IP}/api/reject/${blackId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            alert(response.data || "신고가 반송 처리되었습니다.");
            getReports(); // 신고 반송 후 신고 목록 갱신
        } catch (error) {
            console.error("Error rejecting report:", error);
        }
    };

    return (
        <div className="blacklist-container">
            <h1>신고받은 내역</h1>
            <ul className="report-list">
                {reports.map(report => (
                    <li key={report.blackId} className="report-item">
                        <p>작성자 ID: {report.blackUser}</p>
                        <p>신고 사유: {report.reason}</p>
                        <button onClick={() => fetchUserPosts(report.blackUser)}>게시글 보기</button>
                        <button onClick={() => handleBlacklist(report.blackId)}>블랙리스트 추가</button>
                        <button onClick={() => handleReject(report.blackId)}>반송</button>
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
