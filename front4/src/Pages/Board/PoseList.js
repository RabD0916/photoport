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

const PostList = () => {
    const [profileImages, setProfileImages] = useState({});
    const accessToken = localStorage.getItem("accessToken");
    const boardType = "POSE";
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([{
        id: null,
        title: null,
        createdAt: null,
        view: null,
        like: null,
        bookmark: null,
        writerId: null,
        writerName: null,
        media: {
            mediaName: null,
            categoryName: null
        },
        commentsDto: {
            id: null,
            content: null,
            writerId: null,
            writerName: null
        },
        tags: null
    }]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [sortValue, setSortValue] = useState("view")
    const [sortOrder, setSortOrder] = useState("asc")

    const getBoardList = async () => {
        try {
            const resp = await axios.get(`http://localhost:8080/api/type/${boardType}/${sortValue}/${sortOrder}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp);
            console.log(resp.data);
            setBoardList(resp.data);
            updateProfileImages(resp.data); // 유저별 프로필 가져오기(수정한거니까 받아주세요 예전에는 공유 게시판 들어가면 현재 로그인한 사용자 프로필로 다떳습니다)
        } catch (error) {
            console.error("Error fetching board list:", error);
        }
    };

    const moveToWrite = () => {
        navigate('/Posewrite');
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
            setSelectedPost({ ...selectedPost, commentsDto: { comments: [...selectedPost.commentsDto.comments, resp.data] } });
            setNewComment(""); //댓글 초기화
            getBoardList() //게시글리스트 최신
        } catch (error) {
            console.error("댓글 에러:", error);
        }
    };
    useEffect(() => {
        getBoardList();
    }, []);


    const updateProfileImages = async (boards) => {
        let newImages = {...profileImages};
        for (const post of boards) {
            if (!newImages[post.writerId]) { // 이미 로드된 이미지가 없는 경우에만 요청
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

    useEffect(() => {
        getBoardList();
    }, []); // 의존성 배열을 비워서 컴포넌트 마운트 시에만 호출되도록
    // 좋아요 버튼을 눌렀을 때 실행할 함수
    const handleLike = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8080/api/like/${postId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(response.data);
            getBoardList(); // 게시글 리스트를 다시 가져옴으로써 화면을 최신 상태로 업데이트
        } catch (error) {
            console.error("좋아요 처리 중 에러 발생:", error);
        }
    };

    // 북마크 버튼을 눌렀을 때 실행할 함수
    const handleBookmark = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8080/api/bookmark/${postId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(response.data);
            getBoardList(); // 게시글 리스트를 다시 가져옴으로써 화면을 최신 상태로 업데이트
        } catch (error) {
            console.error("북마크 처리 중 에러 발생:", error);
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
            // 게시글 삭제 후 모달 닫기 및 게시글 목록 새로고침
            alert("해당 게시글이 삭제되었습니다.")
            getBoardList(); // 게시글 리스트를 다시 가져옴으로써 화면을 최신 상태로 업데이트
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error deleting post:", error);
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
                        {/* Report 컴포넌트를 동적으로 로드하여 렌더링 */}
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
            <GalleryContainer>
                <div className="main_board">
                    {boardList.map(post => (
                        <div key={post.id} className="board_item">
                            {/* 게시글 내용 표시 */}
                            {post.title}
                            <div className={"board_content"}>
                                <img src={profileImages[post.writerId]} alt="Profile" className="profile" />
                                {post.writerName}</div>
                            <div className={"img_box"}>
                                {/* 배열의 첫 번째 이미지만 표시. 배열이 비어있지 않은지 확인 필요 */}
                                <img className="board_img" src={`./images/${post.writerId}/${post.media.categoryName}/${post.media.mediaName}`} alt="#"
                                     onClick={() => open_board(post.id)}
                                />
                            </div>
                            <div className={"click_evt"}>
                                <button onClick={() => handleLike(post.id)}><img className={"nav-img"} src={like}
                                                                                 alt={"좋아요"}/>{post.like}</button>
                                <button onClick={() => handleBookmark(post.id)}><img className={"nav-img"} src={sub}
                                                                                     alt={"북마크"}/>{post.bookmark}
                                </button>
                                <div className={"view_"}><img className={"nav-img"} src={view} alt={"view"}/>{post.view}
                                </div>
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

export default PostList;
