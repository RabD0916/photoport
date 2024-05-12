import React, { useState, useEffect } from "react";
import axios from "axios";

const LikeList = () => {
    const [LikeBoards, setLikeBoards] = useState([]);
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const getLikeBoards = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/likedBoards`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log(response);
                setLikeBoards(response.data);
            } catch (error) {
                console.error("Error fetching bookmarked boards:", error);
            }
        };

        getLikeBoards();
    }, []);

    return (
        <div>
            <h2>좋아하는 게시물 목록</h2>
            <ul>
                {LikeBoards.map(board => (
                    <li key={board.id}>
                        <p>게시물 제목: {board.title}</p>
                        {/* 게시물의 기타 정보 표시 */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LikeList;
