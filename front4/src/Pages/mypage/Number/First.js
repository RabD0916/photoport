import React, { useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
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

const Report = React.lazy(() => import("../../Board/Report"));

const First = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [profileImages, setProfileImages] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("id");
    const [cate, setCate] = useState([]);
    const [boardList, setBoardList] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [BoardType, setBoardType] = useState("NORMAL");
    const [currentPage, setCurrentPage] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedPost.media.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedPost.media.length) % selectedPost.media.length);
    };

    useEffect(() => {
        console.log(userId);
        console.log(accessToken);
        async function getCategoryList() {
            const result = await axios.get(
                `${SERVER_IP}/api/sendCategory/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            return result.data;
        }
        getCategoryList().then((r) => setCate(r));
    }, [userId]);

    const getUserBoardList = async () => {
        try {
            const resp = await axios.get(`${SERVER_IP}/api/myBoards`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(resp);
            console.log(resp.data);
            setBoardList(resp.data);
        } catch (error) {
            console.error("Error fetching board list:", error);
        }
    };

    useEffect(() => {
        getUserBoardList();
    }, []);

    useEffect(() => {
        const fetchProfileImages = async () => {
            let newImages = { ...profileImages };
            for (const post of boardList) {
                if (!newImages[post.writerId]) {
                    try {
                        const response = await axios.get(`${SERVER_IP}/api/profile/${post.writerId}`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                "Content-Type": "application/json",
                            },
                        });
                        newImages[post.writerId] = response.data.userProfile;
                    } catch (error) {
                        console.error("Failed to load profile image", error);
                    }
                }
            }
            setProfileImages(newImages);
        };

        fetchProfileImages();
    }, [boardList, accessToken]);

    const open_board = async (postId) => {
        try {
            const resp = await axios.get(`${SERVER_IP}/api/board/${postId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(resp.data);
            setSelectedPost(resp.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching board list:", error);
        }
    };

    const close_board = () => {
        setIsModalOpen(false);
    };

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const submitComment = async () => {
        const data = {
            content: newComment,
        };
        try {
            const resp = await axios.post(
                `${SERVER_IP}/api/comments/${selectedPost.id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(resp);
            setSelectedPost({
                ...selectedPost,
                commentsDto: {
                    comments: [...selectedPost.commentsDto.comments, resp.data],
                },
            });
            setNewComment("");
        } catch (error) {
            console.error("댓글 에러:", error);
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await axios.delete(
                `${SERVER_IP}/api/delete/board/${postId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log("Post deleted:", response);
            alert("해당 게시글이 삭제되었습니다.");
            await getUserBoardList();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };
    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <div className="relative">
                <div
                    className={`fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75 ${
                        isModalOpen ? "block" : "hidden"
                    }`}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-auto">
                        <h3 className="text-2xl font-bold mb-4">게시글 상세페이지</h3>
                        {selectedPost && (
                            <div className="flex">
                                <div
                                    className="w-1/2 pr-4 flex flex-col items-center justify-center overflow-auto border-r border-gray-300 relative">
                                    <button onClick={handlePrevImage}
                                            className="absolute left-0 bg-gray-200 rounded-full px-2 py-1 m-2">◀
                                    </button>
                                    <img
                                        className="w-3/5 h-auto mb-4 object-contain"
                                        src={`./images/${selectedPost.writerId}/${selectedPost.media[currentImageIndex].categoryName}/${selectedPost.media[currentImageIndex].mediaName}`}
                                        alt="사진"
                                    />
                                    <button onClick={handleNextImage}
                                            className="absolute right-0 bg-gray-200 rounded-full px-2 py-1 m-2">▶
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
                                        <Link to={`/board/${selectedPost.id}`}>
                                            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg">수정하기</button>
                                        </Link>
                                        <button
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                                            onClick={close_board}
                                        >
                                            닫기
                                        </button>
                                        {selectedPost && selectedPost.writerId === userId && (
                                            <button
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                                onClick={() => deletePost(selectedPost.id)}
                                            >
                                                삭제
                                            </button>
                                        )}
                                        <Suspense fallback={<div>Loading...</div>}>
                                            {selectedPost && <Report selectedPost={selectedPost} />}
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-center mb-4">
                <button
                    className={`px-4 py-2 mx-2 ${BoardType === "NORMAL" ? "bg-blue-500" : "bg-gray-300"} text-white rounded-lg`}
                    onClick={() => setBoardType("NORMAL")}
                >
                    공유
                </button>
                <button
                    className={`px-4 py-2 mx-2 ${BoardType === "POSE" ? "bg-blue-500" : "bg-gray-300"} text-white rounded-lg`}
                    onClick={() => setBoardType("POSE")}
                >
                    포즈
                </button>
            </div>
            <GalleryContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {boardList.map(
                    (post) =>
                        post.type === BoardType && (
                            <div
                                key={post.id}
                                className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
                            >
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                                    <div className="flex items-center mb-2">
                                        <img
                                            src={profileImages[post.writerId]}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full border-2 border-emerald-400 shadow-emerald-400 mr-2"
                                        />
                                        <span>{post.writerName}</span>
                                    </div>
                                    <div className="mb-2">
                                        {post.media.length > 0 && (
                                            <img
                                                className="w-full h-48 object-cover rounded-lg cursor-pointer"
                                                src={`./images/${post.writerId}/${post.media[0].categoryName}/${post.media[0].mediaName}`}
                                                alt="게시글 이미지"
                                                onClick={() => open_board(post.id)}
                                            />
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center space-x-2">
                                            <img className="w-6 h-6" src={like} alt="좋아요" />
                                            <span>{post.like}</span>
                                            <img className="w-6 h-6" src={comment} alt="댓글" />
                                            <img className="w-6 h-6" src={sub} alt="북마크" />
                                            <span>{post.bookmark}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            조회수 {post.view}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-gray-700 text-sm">
                                        태그: {post.tags}
                                    </div>
                                </div>
                            </div>
                        )
                )}
            </GalleryContainer>
        </div>
    );
};

export default First;
