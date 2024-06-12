import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import "./BoardCss/BoardList.scss";
import like from "../../img/like.png";
import sub from "../../img/sub.png";
import view from "../../img/view.png";

const GalleryContainer = styled.div`
    width: 80%;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

const Report = React.lazy(() => import('./Report'));

const PostList = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;

    const [profileImages, setProfileImages] = useState({});
    const accessToken = localStorage.getItem("accessToken");
    const boardType = "POSE";
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [sortValue, setSortValue] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedPost.media.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedPost.media.length) % selectedPost.media.length);
    };


    const getBoardList = async (page = 0) => {
        try {
            const resp = await axios.get(`${SERVER_IP}/api/type/${boardType}`, {
                params: {
                    page,
                    size: 6, // 한 페이지에 보여줄 게시글 수
                    sortValue,
                    sortOrder
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp);
            setBoardList(resp.data.content);
            setTotalPages(resp.data.totalPages);
            setCurrentPage(resp.data.number);
            updateProfileImages(resp.data.content);
        } catch (error) {
            console.error("Error fetching board list:", error);
        }
    };

    const moveToWrite = () => {
        navigate('/Posewrite');
    };

    const open_board = async (postId) => {
        try {
            const resp = await axios.get(`${SERVER_IP}/api/board/${postId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
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
            content: newComment
        };

        try {
            const resp = await axios.post(`${SERVER_IP}/api/comments/${selectedPost.id}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp);
            setSelectedPost({ ...selectedPost, commentsDto: { comments: [...selectedPost.commentsDto.comments, resp.data] } });
            setNewComment("");
            getBoardList(currentPage);
        } catch (error) {
            console.error("댓글 에러:", error);
        }
    };

    useEffect(() => {
        getBoardList(currentPage);
    }, [currentPage, sortValue, sortOrder]);

    const updateProfileImages = async (boards) => {
        let newImages = { ...profileImages };
        for (const post of boards) {
            if (!newImages[post.writerId]) {
                try {
                    const response = await axios.get(`${SERVER_IP}/api/profile/${post.writerId}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    newImages[post.writerId] = response.data.userProfile;
                } catch (error) {
                    console.error("Failed to load profile image", error);
                }
            }
        }
        setProfileImages(newImages);
    };

    const handleLike = async (postId) => {
        try {
            const response = await axios.post(`${SERVER_IP}/api/like/${postId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(response.data);
            getBoardList(currentPage);
        } catch (error) {
            console.error("좋아요 처리 중 에러 발생:", error);
        }
    };

    const handleBookmark = async (postId) => {
        try {
            const response = await axios.post(`${SERVER_IP}/api/bookmark/${postId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(response.data);
            getBoardList(currentPage);
        } catch (error) {
            console.error("북마크 처리 중 에러 발생:", error);
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await axios.delete(`${SERVER_IP}/api/delete/board/${postId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("Post deleted:", response);
            alert("해당 게시글이 삭제되었습니다.");
            getBoardList(currentPage);
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
        <div className="h-full w-full bg-post-image flex items-center justify-center">
            <div className="max-w-screen-xl mt-6 rounded-2xl p-4">
                <div className="mx-auto lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">포즈 게시판</h2>
                    <hr className="my-4 border-t-2 border-gray-300"/>
                    <button onClick={moveToWrite}
                            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-200 to-pink-400 group-hover:from-pink-300 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-pink-100 shadow-md">
    <span
        className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-pink-600">
        글쓰기
    </span>
                    </button>


                    <div className="mx-auto">
                        <div className={`modal ${isModalOpen ? 'on' : ''} place-content-center`}>
                            <div
                                className="container mt-5 px-2 w-4/5 h-auto bg-white overflow-auto rounded-2xl mx-auto">
                                <h3 className="mt-5">게시글 상세페이지</h3>
                                {selectedPost && (
                                    <div className="flex h-full">
                                        {/* 왼쪽 섹션 - 사진 */}
                                        <div
                                            className="w-1/2 pr-4 flex flex-col items-center justify-center overflow-auto border-r border-gray-300 relative">
                                            <button onClick={handlePrevImage}
                                                    className="absolute left-0 bg-gray-200 rounded-full px-2 py-1 m-2">◀
                                            </button>
                                            <img
                                                className="w-3/5 h-auto mb-4 object-contain"
                                                src={`./images/${selectedPost.writerId}/${selectedPost.media[currentImageIndex].categoryName}/${selectedPost.media[currentImageIndex].mediaName}`}
                                                alt={`사진 ${currentImageIndex + 1}`}
                                            />
                                            <button onClick={handleNextImage}
                                                    className="absolute right-0 bg-gray-200 rounded-full px-2 py-1 m-2">▶
                                            </button>
                                        </div>

                                        {/* 오른쪽 섹션 - 내용 및 태그 */}
                                        <div className="w-1/2 pl-4 flex flex-col justify-between">
                                            <div>
                                                <h3 className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">{selectedPost.title}</h3>
                                                <div
                                                    className="inline-block border-solid rounded-lg border-4 border-gray-500 w-full h-auto text-sm p-2">{selectedPost.content}</div>
                                                <div
                                                    className="font-semibold text-sm mt-4 mb-2">#{selectedPost.tags}</div>
                                            </div>

                                            {/* 댓글 섹션 */}
                                            <div className="w-full bg-white rounded-lg border p-2 my-4 flex-grow">
                                                <div className="flex flex-col max-h-60 overflow-y-auto">
                                                    {selectedPost.commentsDto.comments.map((comment) => (
                                                        <div key={comment.id}
                                                             className="border rounded-md p-3 my-3 flex items-start">
                                                            <img
                                                                className="object-cover w-11 h-11 rounded-full border-2 border-emerald-400 shadow-emerald-400"
                                                                src={profileImages[comment.writerId]}
                                                                alt="profile"
                                                            />
                                                            <div className="ml-3 flex-1">
                                                                <div className="flex justify-between items-center">
                                                                    <h3 className="font-bold">{comment.writerName}</h3>
                                                                </div>
                                                                <p className="text-black-600 mt-2 text-sm">{comment.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* 댓글 작성 창 */}
                                                <div className="w-full px-3 my-2 flex">
                                                    <textarea
                                                        className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
                                                        value={newComment}
                                                        onChange={handleCommentChange}
                                                        placeholder="댓글을 입력하세요"
                                                    />
                                                    <button
                                                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-3 py-1.5 ml-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                                        onClick={submitComment}
                                                    >
                                                        작성
                                                    </button>
                                                </div>
                                            </div>
                                            {/* 닫기 및 신고하기 버튼 */}
                                            <div className="flex justify-end space-x-4 mt-4">
                                                <button
                                                    type="button"
                                                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                                    onClick={close_board}
                                                >
                                                    닫기
                                                </button>
                                                {selectedPost && selectedPost.writerId === userId && (
                                                    <button
                                                        type="button"
                                                        className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2"
                                                        onClick={() => deletePost(selectedPost.id)}
                                                    >
                                                        삭제
                                                    </button>
                                                )}
                                                <Suspense fallback={<div>Loading...</div>}>
                                                    {selectedPost && <Report selectedPost={selectedPost}/>}
                                                </Suspense>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <GalleryContainer>
                        <div className="flex flex-wrap justify-center gap-4">
                            {boardList.map(post => (
                                <div key={post.id}
                                     className="bg-white px-6 pt-6 pb-2 rounded-xl shadow-lg transform hover:scale-105 transition duration-500 border-4 border-gray-400 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex flex-col justify-between flex-grow">
                                    <div>
                                        <div className="mb-1 text-xl font-bold text-black">{post.title}</div>
                                        <hr className="my-4 border-t-2 border-blue-200"/>
                                        <div className="flex items-center px-2 py-3">
                                            <img src={profileImages[post.writerId]} alt="Profile"
                                                 className="object-cover w-11 h-11 rounded-full border-2 border-blue-400 shadow-blue-400"/>
                                            <div>
                                                <span className="ml-4 text-xl font-semibold antialiased block leading-tight text-black">{post.writerName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative flex justify-center items-center w-full h-[300px]">
                                        <img
                                            className="max-w-full max-h-full object-contain rounded-xl"
                                            src={`./images/${post.writerId}/${post.media.categoryName}/${post.media.mediaName}`}
                                            alt="#"
                                            onClick={() => open_board(post.id)}
                                        />
                                    </div>
                                    <hr className="my-4 border-t-2 border-blue-200"/>
                                    <div>
                                        <div className="flex items-center justify-between mx-4 mt-3 mb-2">
                                            <div className="flex gap-5">
                                                <button onClick={() => handleLike(post.id)}>
                                                    <img className="h-6 w-6 mb-1.5" src={like} alt="좋아요"/>
                                                    <span className="text-black">{post.like}</span>
                                                </button>
                                                <button onClick={() => handleBookmark(post.id)}>
                                                    <img className="h-6 w-6 mb-1.5" src={sub} alt="북마크"/>
                                                    <span className="text-black">{post.bookmark}</span>
                                                </button>
                                                <div className="view_">
                                                    <img className="h-6 w-6 mb-1.5" src={view} alt="view"/>
                                                    <span className="text-black">{post.view}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="my-4 border-t-2 border-blue-200"/>
                                        <div className="font-semibold text-sm mx-4 mt-2 mb-4 text-black">
                                            #{post.tags}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GalleryContainer>






                    <PaginationContainer>
                        <button  className={"relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500" +
                            " group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"} onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                            <span className={"relative px-5 py-2.5 transition-all ease-in duration-75 bg-white white:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-black"}>이전</span>
                        </button>
                        {Array.from({length: totalPages}, (_, index) => (
                            <button className={"relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500" +
                                " group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"} key={index} onClick={() => handlePageChange(index)}
                                    disabled={index === currentPage}>
                                <span className={"relative px-5 py-2.5 transition-all ease-in duration-75 bg-white white:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-black"}>{index +1}</span>
                            </button>
                        ))}
                        <button className={"relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500" +
                            " group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"} onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}>
                            <span className={"relative px-5 py-2.5 transition-all ease-in duration-75 bg-white white:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-black"}>다음</span>
                        </button>
                    </PaginationContainer>
                </div>
            </div>
        </div>
    )
};

export default PostList;
