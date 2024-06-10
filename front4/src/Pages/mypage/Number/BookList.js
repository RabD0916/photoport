import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const GalleryContainer = styled.div`
    display: flex;
    flex: 0 0 10%;
    flex-wrap: wrap;
    margin: 0;
`;

const BookList = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [BookmarkedBoards, setBookmarkedBoards] = useState([]);
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const getBookmarkedBoards = async () => {
            try {
                const response = await axios.get(`${SERVER_IP}/api/bookmarkedBoards`, {
                    headers: {
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
            <h2 className="text-2xl font-bold mb-4">북마크한 게시물 목록</h2>
            <GalleryContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {BookmarkedBoards.length > 0 ? BookmarkedBoards.map(board => (
                    <div key={board.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">{board.title}</h3>
                            <div className="mb-2">
                                {board.media.length > 0 && board.media.map((media, index) => (
                                    <img
                                        key={index}
                                        className="w-full h-48 object-cover rounded-lg mb-2"
                                        src={`./images/${board.writerId}/${media.categoryName}/${media.mediaName}`}
                                        alt="게시글 이미지"
                                    />
                                ))}
                            </div>
                            <div className="mt-2 mb-2 text-gray-700 text-sm">
                                <p>내용: {board.content}</p>
                                <p>태그: {board.tags}</p>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-center text-gray-500">북마크한 게시물이 없습니다.</p>}
            </GalleryContainer>
        </div>
    );
};

export default BookList;
