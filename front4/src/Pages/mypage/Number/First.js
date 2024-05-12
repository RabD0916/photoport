import React, {Suspense, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import styled from 'styled-components';
import "../Number/First.scss";
import like from "../../../img/like.png";
import comment from "../../../img/comment.png";
import sub from "../../../img/sub.png";

const GalleryContainer = styled.div`
  display: flex;
  flex: 0 0 10%; /* 각 항목이 4개가 나열될 수 있도록 25%의 너비를 설정 */
  flex-wrap: wrap;
  margin: 0;
`;
// Report 컴포넌트를 동적으로 로드하기 위한 Lazy 로딩
const Report = React.lazy(() => import('../../Board/Report'));

const First = () => {
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기 URL을 위한 상태
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const [cate, setCate] = useState([]);
    const [boardList, setBoardList] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [BoardType, setBoardType] = useState("");

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
    useEffect(() => {
        console.log(userId);
        console.log(accessToken);
        async function getCategoryList() {
            const result = await axios.get(
                `http://localhost:8080/api/sendCategory/${userId}`,
                {
                    headers : {
                        Authorization : `Bearer ${accessToken}`
                    }
                }
            );
            return result.data;
        }
        getCategoryList().then(r => setCate(r));
    }, [userId]);

    const getUserBoardList = async () => {
        try {
            const resp = await axios.get('http://localhost:8080/api/myBoards', {
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

    useEffect(() => {
        getUserBoardList();
    }, []);

    useEffect(() => {
        {boardList.map(post => (
            axios.get(`http://localhost:8080/api/profile/${post.writerId}`, {
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
            setSelectedPost({ ...selectedPost, commentsDto: { comments: [...selectedPost.commentsDto.comments, resp.data] } });
            setNewComment(""); //댓글 초기화
            // window.location.reload();
            // getBoardList() //게시글리스트 최신
        } catch (error) {
            console.error("댓글 에러:", error);
        }
    };

    // 게시글 삭제 요청
    const deletePost = async (postId) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/delete/board/${postId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("Post deleted:", response);
            // 게시글 삭제 후 모달 닫기 및 게시글 목록 새로고침
            alert("해당 게시글이 삭제되었습니다.")
            await getUserBoardList();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };
    return (
        <div>
            <div className={"Detail_page"}>
                <div className={`modal ${isModalOpen ? 'on' : ''}`}>
                    <div className="report_popup">
                        <h3>게시글 상세페이지</h3>
                        {selectedPost && (
                            <div>
                                <Link to={`/board/${selectedPost.id}`}>
                                    <button>수정하기</button>
                                </Link>
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
                                {/* 게시글의 다른 필드들을 여기에 추가 */}
                                <div className="comments">
                                    <h4>댓글</h4>
                                    {selectedPost.commentsDto.comments.map((comment) => (
                                        <div key={comment.id}>
                                            <p>{comment.writerName}: {comment.content}</p>
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
                            <Report selectedPost={selectedPost}/>
                        </Suspense>
                        <button type="button" className="close_btn" onClick={close_board}>닫기</button>
                        {selectedPost && selectedPost.writerId === userId && (
                            <button type="button" className="close_btn"
                                    onClick={() => deletePost(selectedPost.id)}>삭제</button>
                        )}
                    </div>
                </div>
            </div>
            <button onClick={() => setBoardType("NORMAL")}>공유</button>
            <button onClick={() => setBoardType("POSE")}>포즈</button>
            <GalleryContainer>
                <div className="main_board2">
                    {boardList.map(post => (
                        (post.type === BoardType) && (
                            <div key={post.id} className="board_item2">
                                {/* 게시글 내용 표시 */}
                                {post.title}
                                <div className={"board_content2"}>
                                    <img src={previewImage || profileImage} alt="Profile2" className="Profile2" />
                                    {post.writerName}
                                </div>
                                <div className={"img_box2"}>
                                    {/* 배열의 첫 번째 이미지만 표시. 배열이 비어있지 않은지 확인 필요 */}
                                    {post.media.length > 0 && (
                                        <img className="board_img2"
                                             src={`./images/${post.writerId}/${post.media[0].categoryName}/${post.media[0].mediaName}`}
                                             alt="#"
                                             onClick={() => open_board(post.id)}
                                        />
                                    )}
                                </div>
                                <div className={"click_evt2"}>
                                    <img className={"nav-img2"} src={like} alt={"좋아요"} /><p>{post.like}</p>
                                    <img className={"nav-img2"} src={comment} alt={"댓글"} />
                                    <img className={"nav-img2"} src={sub} alt={"북마크"} /><p>{post.bookmark}</p>
                                    <p className={"view_2"}>view{post.view}</p>
                                </div>
                                <div className={"content_box2"}>태그 : {post.tags}</div>
                            </div>
                        )
                    ))}
                </div>
            </GalleryContainer>
        </div>
    )

}

export default First;