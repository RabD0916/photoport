import React, { useState, useEffect } from "react";
import axios from "axios";

const BookList = () => {
    const [BookmarkedBoards, setBookmarkedBoards] = useState([]);
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const getBookmarkedBoards = async () => {
            try {
                // URL 경로 확인
                const response = await axios.get(`http://localhost:8080/api/bookmarkedBoards`, {
                    headers: {
                        // 토큰 포맷 확인
                        Authorization: `Bearer ${accessToken}`
                    },
                });
                console.log(response);
                if (response.status === 200) {
                    setBookmarkedBoards(response.data);
                } else {
                    console.error("Response status:", response.status);
                }
            } catch (error) {
                console.error("Error fetching bookmarked boards:", error);
            }
        };

        getBookmarkedBoards();
    }, []);

    return (
        <div>
            <h2>북마크한 게시물 목록</h2>
            <ul>
                {BookmarkedBoards.length > 0 ? BookmarkedBoards.map(board => (
                    <li key={board.id}>
                        <p>게시물 제목: {board.title}</p>
                        <p>게시물 내용: {board.content}</p>
                        <p>게시물 태그: {board.tags}</p>
                        {/* 게시물의 기타 정보 표시 */}
                    </li>
                )) : <p>북마크한 게시물이 없습니다.</p>}
            </ul>
        </div>
    );
};

export default BookList;