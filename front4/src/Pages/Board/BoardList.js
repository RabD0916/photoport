import React, { Suspense, useEffect, useState } from 'react';
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
            const resp = await axios.get(`http://localhost:8080/api/type/${boardType}`, {
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
            const resp = await axios.get(`http://localhost:8080/api/board/${postId}`, {
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
            const resp = await axios.post(`http://localhost:8080/api/comments/${selectedPost.id}`, data, {
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
                    const response = await axios.get(`http://localhost:8080/api/profile/${post.writerId}`, {
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
            const response = await axios.post(`http://localhost:8080/api/like/${postId}`, {}, {
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
            const response = await axios.post(`http://localhost:8080/api/bookmark/${postId}`, {}, {
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
            const data = { content: content }
            const response = await axios.post(`http://localhost:8080/api/updateComments/${commentId}`, data, {
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
            const response = await axios.delete(`http://localhost:8080/api/deleteComments/${postId}`, {
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
            const response = await axios.delete(`http://localhost:8080/api/delete/board/${postId}`, {
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
        <div>
            <div>
                <button onClick={moveToWrite}>글쓰기</button>
            </div>
            <div className={"Detail_page"}>
                <div className={`modal ${isModalOpen ? 'on' : ''}`}>
                    <div className="report_popup">
                        <h3>게시글 상세페이지</h3>
                        {selectedPost && (
                            <div>
                                <p>제목: {selectedPost.title}</p>
                                <p>사진:</p>
                                {selectedPost.media.map((media, index) => (
                                    <img
                                        key={index}
                                        className={"detail_img"}
                                        src={`./images/${selectedPost.writerId}/${media.categoryName}/${media.mediaName}`}
                                        alt={`사진 ${index + 1}`}
                                    />
                                ))}

                                <p>내용: {selectedPost.content}</p>
                                <div className="comments">
                                    <h4>댓글</h4>
                                    {selectedPost.commentsDto.comments.map((comment) => (
                                        <div key={comment.id}>
                                            <p>{comment.writerName}: {comment.content}</p>
                                            {comment.writerId === userId && (
                                                <div>
                                                    {comment.writerId === userId && (
                                                        <>
                                                            {comment.id === commentId && upComment ? (
                                                                <>
                                                                    <input type="text" value={content} onChange={(e) => setContent(e.target.value)} /><button onClick={() => comment_update(comment.id, content)}>수정완료</button>
                                                                </>
                                                            ) : (
                                                                <button onClick={() => {
                                                                    setupComment(true);
                                                                    setCommentId(comment.id);
                                                                }}>수정</button>
                                                            )}
                                                            <button onClick={() => comment_delete(comment.id)}>삭제</button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className={"comment-write"}>
                                    <h4>댓글 쓰기</h4>
                                    <textarea
                                        value={newComment}
                                        onChange={handleCommentChange}
                                        placeholder="댓글을 입력하세요"
                                    />
                                    <button onClick={submitComment}>작성</button>
                                </div>
                            </div>
                        )}
                        <Suspense fallback={<div>Loading...</div>}>
                            {selectedPost && <Report selectedPost={selectedPost} />}
                        </Suspense>
                        <button type="button" className="close_btn" onClick={close_board}>닫기</button>
                        {selectedPost && selectedPost.writerId === userId && (
                            <button type="button" className="close_btn" onClick={() => deletePost(selectedPost.id)}>삭제</button>
                        )}
                    </div>
                </div>
            </div>
            <GalleryContainer>
                <div className="main_board">
                    {boardList.map(post => (
                        <div key={post.id} className="board_item">
                            {post.title}
                            <div className={"board_content"}>
                                <img src={profileImages[post.writerId]} alt="Profile" className="profile" />
                                {post.writerName}</div>
                            <div className={"img_box"}>
                                <img className="board_img"
                                     src={`./images/${post.writerId}/${post.media.categoryName}/${post.media.mediaName}`}
                                     alt="#"
                                     onClick={() => open_board(post.id)}
                                />
                            </div>
                            <div className={"click_evt"}>
                                <button onClick={() => handleLike(post.id)}><img className={"nav-img"} src={like} alt={"좋아요"} />{post.like}</button>
                                <button onClick={() => handleBookmark(post.id)}><img className={"nav-img"} src={sub} alt={"북마크"} />{post.bookmark}</button>
                                <div className={"view_"}><img className={"nav-img"} src={view} alt={"view"} />{post.view}</div>
                            </div>
                            <div>
                                태그: {post.tags}
                            </div>
                        </div>
                    ))}
                </div>
            </GalleryContainer>
            <PaginationContainer>
                <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                    이전
                </PageButton>
                {Array.from({ length: totalPages }, (_, index) => (
                    <PageButton key={index} onClick={() => handlePageChange(index)} disabled={index === currentPage}>
                        {index + 1}
                    </PageButton>
                ))}
                <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
                    다음
                </PageButton>
            </PaginationContainer>
        </div>
    );
};

export default BoardList;