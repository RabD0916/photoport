import React, { useState, useEffect } from "react";
import axios from "axios";
import like from "../../../img/like.png";
import comment from "../../../img/comment.png";
import sub from "../../../img/sub.png";

const LikeList = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [LikeBoards, setLikeBoards] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const getLikeBoards = async () => {
            try {
                const response = await axios.get(`${SERVER_IP}/api/likedBoards`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log(response);
                setLikeBoards(response.data);

                // Fetch profile images
                const profileImagesData = {};
                for (const board of response.data) {
                    if (!profileImagesData[board.writerId]) {
                        const profileResponse = await axios.get(`${SERVER_IP}/api/profile/${board.writerId}`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        });
                        profileImagesData[board.writerId] = profileResponse.data.userProfile;
                    }
                }
                setProfileImages(profileImagesData);
            } catch (error) {
                console.error("Error fetching liked boards:", error);
            }
        };

        getLikeBoards();
    }, [accessToken, SERVER_IP]);

    return (
        <div className="mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">좋아하는 게시물 목록</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {LikeBoards.length > 0 ? LikeBoards.map(board => (
                    <li key={board.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold mb-2">{board.title}</h3>
                            <div className="flex items-center mb-2">
                                <img
                                    src={profileImages[board.writerId]}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border-2 border-emerald-400 shadow-emerald-400 mr-2"
                                />
                                <span>{board.writerName}</span>
                            </div>
                            <div className="mb-2">
                                {board.media.map((mediaItem, index) => (
                                    <img
                                        key={index}
                                        className="w-full h-48 object-cover rounded-lg mb-2"
                                        src={`./images/${board.writerId}/${mediaItem.categoryName}/${mediaItem.mediaName}`}
                                        alt="게시글 이미지"
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center space-x-2">
                                    <img className="w-6 h-6" src={like} alt="좋아요" />
                                    <span>{board.like}</span>
                                    <img className="w-6 h-6" src={comment} alt="댓글" />
                                    <img className="w-6 h-6" src={sub} alt="북마크" />
                                    <span>{board.bookmark}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    조회수 {board.view}
                                </div>
                            </div>
                            <div className="mt-2 text-gray-700 text-sm">
                                태그: {board.tags}
                            </div>
                        </div>
                    </li>
                )) : <p className="col-span-full text-center">좋아하는 게시물이 없습니다.</p>}
            </ul>
        </div>
    );
};

export default LikeList;
