import React, {Suspense, useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';
// import "./BoardCss/BoardList.scss";
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

const PageButton = styled.button`
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

const Report = React.lazy(() => import('./Report'));

const BoardList = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [profileImages, setProfileImages] = useState({});
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const boardType = "NORMAL";
    const navigate = useNavigate();
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [upComment, setupComment] = useState(false);
    const [content, setContent] = useState('');
    const [commentId, setCommentId] = useState('');
    const [boardList, setBoardList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortValue, setSortValue] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const getBoardList = async (page = 0) => {
        try {
            const resp = await axios.get(`${SERVER_IP}/api/type/${boardType}`, {
                params: {
                    page,
                    size: 5, // 한 페이지에 보여줄 게시글 수
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
        navigate('/Boardwrite');
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
            // 댓글 작성 후에는 해당 게시물의 정보를 업데이트하여 선택된 게시물로 설정
            setSelectedPost({
                ...selectedPost,
                commentsDto: {comments: [...selectedPost.commentsDto.comments, resp.data]}
            });
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
        let newImages = {...profileImages};
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

    const comment_update = async (commentId, content) => {
        try {
            const data = {content: content}
            const response = await axios.post(`${SERVER_IP}/api/updateComments/${commentId}`, data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            if (response.status === 200) {
                alert("업데이트 완료.");
                await open_board(selectedPost.id);
                setupComment(false);
                setContent('');
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const comment_delete = async (postId) => {
        try {
            const response = await axios.delete(`${SERVER_IP}/api/deleteComments/${postId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("Post deleted:", response);
            await open_board(selectedPost.id);
            alert("해당 댓글이 삭제되었습니다.");
        } catch (error) {
            console.error("Error deleting post:", error);
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
            alert("해당 게시글이 삭제되었습니다.")
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
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-9 lg:px-8">
                <div className="mx-auto lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">공유 게시판</h2>
                    <div>
                        <button onClick={moveToWrite}>글쓰기</button>
                    </div>
                    <div className={"container mx-auto"}>
                        <div className={`modal ${isModalOpen ? 'on' : ''}`}>
                            <div className="container mt-5 px-2 w-1/2 h-auto bg-white">
                                <h3 className={"mt-5"}>게시글 상세페이지</h3>
                                {selectedPost && (
                                    <div>
                                        <h3 className="mt-3 relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">{selectedPost.title}</h3>
                                        {selectedPost.media.map((media, index) => (
                                            <img
                                                key={index}
                                                className={"flex flex-wrap w-1/5 h-1/5 center-align"}
                                                src={`./images/${selectedPost.writerId}/${media.categoryName}/${media.mediaName}`}
                                                alt={`사진 ${index + 1}`}
                                            />
                                        ))}

                                        <h3 className={"font-bold"}>Content</h3>
                                        <div
                                            className={"inline-block border-solid rounded-lg border-4 border-gray-500 w-4/5 h-40 text-2xl content-center"}>{selectedPost.content}
                                        </div>
                                        <Suspense fallback={<div>Loading...</div>}>
                                            {selectedPost && <Report selectedPost={selectedPost}/>}
                                        </Suspense>
                                        <div className="w-4/5 bg-white rounded-lg border p-2 my-4 mx-6 inline-block">
                                            <h3 className={"font-bold mt-4"}>Comments</h3>
                                            <div className={"flex flex-col"}>
                                                {selectedPost.commentsDto.comments.map((comment) => (
                                                    <div key={comment.id}>
                                                        <div className={"border rounded-md p-3 ml-3 my-3"}>
                                                            <div className={"flex gap-3 items-center"}>
                                                                <img
                                                                    className={"object-cover w-11 h-11 rounded-full \n" +
                                                                        "border-2 border-emerald-400  shadow-emerald-400"}
                                                                    src={profileImages[comment.writerId]}
                                                                    alt={"profile"}/>
                                                                <h3 className={"font-bold"}>{comment.writerName}</h3>
                                                            </div>
                                                            <p className={"text-black-600 mt-2 text-2xl"}>{comment.content}</p>
                                                        </div>
                                                        {comment.writerId === userId && (
                                                            <div>
                                                                {comment.writerId === userId && (
                                                                    <>
                                                                        {comment.id === commentId && upComment ? (
                                                                            <>
                                                                                <input type="text" value={content}
                                                                                       onChange={(e) => setContent(e.target.value)}/>
                                                                                <button
                                                                                    onClick={() => comment_update(comment.id, content)}>수정완료
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <button
                                                                            className={"text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 \n" +
                                                                                "me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"}
                                                                                onClick={() => {
                                                                                setupComment(true);
                                                                                setCommentId(comment.id);
                                                                            }}>수정</button>
                                                                        )}
                                                                        <button
                                                                            className={"text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 \n"+
                                                                                "me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"}
                                                                            onClick={() => comment_delete(comment.id)}>삭제
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={"w-full px-3 my-2"}>
                                            <textarea
                                                className={"bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-3/5 h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"}
                                                value={newComment}
                                                onChange={handleCommentChange}
                                                placeholder="댓글을 입력하세요"
                                            />
                                        </div>
                                        <div className={"w-full flex justify-center px-3 "}>
                                            <button
                                                className={"text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300" +
                                                    "font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 "}
                                                onClick={submitComment}>작성
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2
                                 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700" onClick={close_board}>닫기</button>
                                {selectedPost && selectedPost.writerId === userId && (
                                    <button type="button" className="close_btn"
                                            onClick={() => deletePost(selectedPost.id)}>삭제</button>
                                )}
                            </div>
                        </div>
                    </div>
                    <GalleryContainer>
                        <div className="min-h-screen bg-gradient-to-tr from-red-300 to-yellow-200 flex justify-center items-center py-20">
                            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 px-4">
                                {boardList.map(post => (
                                    <div key={post.id} className="bg-white px-6 pt-6 pb-2 rounded-xl shadow-lg transform hover:scale-105 transition duration-500">
                                        <div className="mb-3 text-xl font-bold text-indigo-600">{post.title}</div>
                                        <div className="flex items-center px-2 py-3">
                                            <img src={profileImages[post.writerId]} alt="Profile" className="object-cover w-11 h-11 rounded-full border-2 border-emerald-400 shadow-emerald-400"/>
                                            <div>
                                                <span className="ml-4 text-xl font-semibold antialiased block leading-tight">{post.writerName}</span>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <img
                                                className="w-full rounded-xl"
                                                src={`./images/${post.writerId}/${post.media.categoryName}/${post.media.mediaName}`}
                                                alt="#"
                                                onClick={() => open_board(post.id)}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between mx-4 mt-3 mb-2">
                                            <div className="flex gap-5">
                                                <button onClick={() => handleLike(post.id)}>
                                                    <img className="h-6 w-6 text-indigo-600 mb-1.5" src={like} alt="좋아요"/>{post.like}
                                                </button>
                                                <button onClick={() => handleBookmark(post.id)}>
                                                    <img className="h-6 w-6 text-indigo-600 mb-1.5" src={sub} alt="북마크"/>{post.bookmark}
                                                </button>
                                                <div className="view_">
                                                    <img className="h-6 w-6 text-indigo-600 mb-1.5" src={view} alt="view"/>{post.view}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-semibold text-sm mx-4 mt-2 mb-4">
                                            #{post.tags}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GalleryContainer>

                    <PaginationContainer>
                        <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                            이전
                        </PageButton>
                        {Array.from({length: totalPages}, (_, index) => (
                            <PageButton key={index} onClick={() => handlePageChange(index)}
                                        disabled={index === currentPage}>
                                {index + 1}
                            </PageButton>
                        ))}
                        <PageButton onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages - 1}>
                            다음
                        </PageButton>
                    </PaginationContainer>
                </div>
            </div>
        </div>
    );
};

export default BoardList;
