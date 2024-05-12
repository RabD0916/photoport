import React, { useState, useEffect } from "react";
import axios from "axios";

const BookList = () => {
    const [bookmarkedBoards, setBookmarkedBoards] = useState([]);
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const getBookmarkedBoards = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/bookmarkedBoards`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setBookmarkedBoards(response.data);
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
                {bookmarkedBoards.map(board => (
                    <li key={board.id}>
                        <p>게시물 제목: {board.title}</p>
                        <p>게시물 내용: {board.content}</p>
                        <p>게시물 태그: {board.tags}</p>
                        {/* 게시물의 기타 정보 표시 */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;
