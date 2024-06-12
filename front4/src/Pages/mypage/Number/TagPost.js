import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import styled from "styled-components";
import like from "../../../img/like.png";
import comment from "../../../img/comment.png";
import sub from "../../../img/sub.png";

const GalleryContainer = styled.div`
    display: flex;
    flex: 0 0 10%;
    flex-wrap: wrap;
    margin: 0;
`;

const TagPost = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [tagPosts, setTagPosts] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const accessToken = localStorage.getItem("accessToken");
    const tagName = localStorage.getItem("id");

    useEffect(() => {
        const getTagAlarms = async () => {
            try {
                const response = await axios.get(`${SERVER_IP}/api/tag/${tagName}/alarms`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                console.log(response);
                if (response.status === 200) {
                    setTagPosts(Array.isArray(response.data) ? response.data : []);

                    const profileImagesData = {};
                    for (const post of response.data) {
                        if (!profileImagesData[post.writerId]) {
                            const profileResponse = await axios.get(`${SERVER_IP}/api/profile/${post.writerId}`, {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`
                                }
                            });
                            profileImagesData[post.writerId] = profileResponse.data.userProfile;
                        }
                    }
                    setProfileImages(profileImagesData);
                } else {
                    console.error("Response status:", response.status);
                }
            } catch (error) {
                console.error("Error fetching tag alarms:", error);
            }
        };

        getTagAlarms();
    }, [tagName]);

    const openBoard = async (postId) => {
        try {
            const response = await axios.get(`${SERVER_IP}/api/board/${postId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setSelectedPost(response.data);
            setIsModalOpen(true);
            setCurrentImageIndex(0);
        } catch (error) {
            console.error("Error fetching post details:", error);
        }
    };

    const closeBoard = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
        setCurrentImageIndex(0);
    };

    const handleNextImage = () => {
        if (selectedPost && selectedPost.media && selectedPost.media.length > 0) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedPost.media.length);
        }
    };

    const handlePrevImage = () => {
        if (selectedPost && selectedPost.media && selectedPost.media.length > 0) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedPost.media.length) % selectedPost.media.length);
        }
    };

    return (
        <div className="mx-auto p-4 max-w-7xl">
            <h2 className="text-2xl font-bold mb-4 text-center">태그 알림 게시물 목록</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tagPosts.length > 0 ? tagPosts.map(post => (
                    <div
                        key={post.id}
                        className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between cursor-pointer"
                        onClick={() => openBoard(post.id)}
                    >
                        <div className="mb-4 text-center">
                            <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                            <div className="flex items-center justify-center mb-2">
                                <img
                                    src={profileImages[post.writerId]}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border-2 border-emerald-400 shadow-emerald-400 mr-2"
                                />
                                <span>{post.writerId}</span>
                            </div>
                            <div className="mb-2 flex justify-center">
                                {post.media && post.media.length > 0 && (
                                    <img
                                        className="w-full h-48 object-cover rounded-lg cursor-pointer"
                                        src={`./images/${post.writerId}/${post.media[0].categoryName}/${post.media[0].mediaName}`}
                                        alt="게시글 이미지"
                                    />
                                )}
                            </div>
                            <div className="flex justify-center items-center mt-2 space-x-2">
                                <img className="w-6 h-6" src={like} alt="좋아요"/>
                                <span>{post.like}</span>
                                <img className="w-6 h-6" src={comment} alt="댓글"/>
                                <img className="w-6 h-6" src={sub} alt="북마크"/>
                                <span>{post.bookmark}</span>
                            </div>
                            <div className="text-sm text-gray-600 text-center">
                                조회수 {post.view}
                            </div>
                            <div className="mt-2 text-gray-700 text-sm text-center">
                                태그: {post.tags}
                            </div>
                        </div>
                    </div>
                )) : <p className="col-span-full text-center">해당 태그의 게시물이 없습니다.</p>}
            </div>

            {isModalOpen && selectedPost && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full h-auto mx-4 my-4">
                        <h3 className="text-2xl font-bold mb-4">게시글 상세페이지</h3>
                        <div className="flex">
                            <div
                                className="w-1/2 pr-4 flex flex-col items-center justify-center overflow-auto border-r border-gray-300 relative">
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-0 bg-gray-200 rounded-full px-2 py-1 m-2"
                                >
                                    ◀
                                </button>
                                <img
                                    className="w-3/5 h-auto mb-4 object-contain"
                                    src={`./images/${selectedPost.writerId}/${selectedPost.media[currentImageIndex].categoryName}/${selectedPost.media[currentImageIndex].mediaName}`}
                                    alt={`사진 ${currentImageIndex + 1}`}
                                />
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-0 bg-gray-200 rounded-full px-2 py-1 m-2"
                                >
                                    ▶
                                </button>
                            </div>
                            <div className="w-1/2 pl-4 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">{selectedPost.title}</h3>
                                    <div className="mt-2 mb-4 p-4 border border-gray-300 rounded-lg">
                                        {selectedPost.content}
                                    </div>
                                    <div className="font-semibold text-sm mb-2">
                                        #{selectedPost.tags}
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg border p-4 my-4 flex-grow">
                                    <h4 className="text-lg font-bold mb-4">댓글</h4>
                                    <div className="flex flex-col max-h-60 overflow-y-auto mb-4">
                                        {selectedPost.commentsDto.comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="border-b border-gray-200 py-2 flex items-start"
                                            >
                                                <img
                                                    className="object-cover w-8 h-8 rounded-full border-2 border-emerald-400 shadow-emerald-400"
                                                    src={profileImages[comment.writerId]}
                                                    alt="profile"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <h5 className="font-semibold">{comment.writerName}</h5>
                                                    </div>
                                                    <p className="text-gray-600 mt-1">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                        onClick={closeBoard}
                                    >
                                        닫기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagPost;
