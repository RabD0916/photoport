import React, {useEffect, useState, Suspense} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
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

// Report 컴포넌트를 동적으로 로드하기 위한 Lazy 로딩
const Report = React.lazy(() => import('./Report'));

const BoardList = () => {
    const [profileImage, setProfileImage] = useState(null);
    const accessToken = localStorage.getItem("accessToken");
    const id = localStorage.getItem("id");
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState("");

    const getBoardList = async () => {
        try {
            const resp = await axios.get('http://localhost:8080/api/boards', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp);
            console.log(resp.data);
            setBoardList(resp.data);
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
        setNewComment(event.target.value); // 댓글 내용 변경 시 상태 업데이트
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
            // 댓글 작성 후에는 해당 게시물의 정보를 업데이트하여 선택된 게시물로 설정
            setSelectedPost({ ...selectedPost, dtos: { comments: [...selectedPost.dtos.comments, resp.data] } });
            setNewComment(""); //댓글 초기화
            getBoardList() //게시글리스트 최신
        } catch (error) {
            console.error("댓글 에러:", error);
        }
    };
    useEffect(() => {
        getBoardList();
    }, []);


    useEffect(() => {
        {boardList.map(post => (
            axios.get(`http://localhost:8080/api/profile/${post.writer}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setProfileImage(response.data.userProfile);
                })
                .catch(error => console.error("Failed to load profile image", error))
        ))}
    })

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
                                        src={`./images/${id}/${media.categoryName}/${media.mediaName}`}
                                        alt={`사진 ${index + 1}`}
                                    />
                                ))}

                                <p>내용: {selectedPost.content}</p>
                                {/* 게시글의 다른 필드들을 여기에 추가 */}
                                <div className="comments">
                                    <h4>댓글</h4>
                                    {selectedPost.dtos.comments.map((comment) => (
                                        <div key={comment.id}>
                                            <p>{comment.writer}: {comment.content}</p>
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
                        {/* Report 컴포넌트를 동적으로 로드하여 렌더링 */}
                        <Suspense fallback={<div>Loading...</div>}>
                            <Report selectedPost={selectedPost}/>
                        </Suspense>
                        <button type="button" className="close_btn" onClick={close_board}>닫기</button>
                    </div>
                </div>
            </div>
            <GalleryContainer>
                <div className="main_board">
                    {boardList.map(post => (
                        <div key={post.id} className="board_item">
                            {/* 게시글 내용 표시 */}
                            {post.title}
                            <div className={"board_content"}>
                                <img src={profileImage} alt="Profile" className="profile" />
                            {post.writer}</div>
                            <div className={"img_box"}>
                                {/* 배열의 첫 번째 이미지만 표시. 배열이 비어있지 않은지 확인 필요 */}
                                <img className="board_img" src={`./images/${id}/${post.media.categoryName}/${post.media.mediaName}`} alt="#"
                                     onClick={() => open_board(post.id)}
                                />
                            </div>
                            <div className={"click_evt"}>
                                <button><img className={"nav-img"} src={like} alt={"좋아요"}/>{post.like}</button>
                                <button><img className={"nav-img"} src={sub} alt={"북마크"}/>{post.bookmark}</button>
                                <div className={"view_"}><img className={"nav-img"} src={view} alt={"view"}/>{post.view}</div>
                            </div>
                            <div>
                                태그: {post.tags}
                            </div>
                        </div>
                    ))}
                </div>
            </GalleryContainer>

        </div>
    );
};

export default BoardList;
