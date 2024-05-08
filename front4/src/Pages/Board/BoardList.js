import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import "./BoardCss/BoardList.scss";
import like from "../../img/like.png";
import sub from "../../img/sub.png";
import comment from "../../img/board.png";
import heart from "../../img/heart.png";

const GalleryContainer = styled.div`
    width: 80%;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
`;

// Report 컴포넌트를 동적으로 로드하기 위한 Lazy 로딩
const Report = React.lazy(() => import('./Report'));

const BoardList = () => {
    const accessToken = localStorage.getItem("accessToken");
    const id = localStorage.getItem("id");
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const getBoardList = async () => {
        try {
            const resp = await axios.get('http://localhost:8080/api/boards', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp);
            console.log(resp.data);
            console.log(`./images/${id}/${resp.data[0].media.categoryName}/${resp.data[0].media.mediaName}`)
            setBoardList(resp.data);
        } catch (error) {
            console.error("Error fetching board list:", error);
        }
    };

    // boardList 변경 될 때 마다 실행
    useEffect(() => {
        if(boardList == null || boardList.length === 0) return;
        console.log(boardList)
    }, [boardList]);

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

    useEffect(() => {
        getBoardList();
    }, []);

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
                        <div key={post.id} className="board_item" onClick={() => open_board(post.id)}>
                            {/* 게시글 내용 표시 */}
                            <div className={"img_box"}>
                                {/* 배열의 첫 번째 이미지만 표시. 배열이 비어있지 않은지 확인 필요 */}
                                <img className="board_img" src={`./images/${id}/${post.media.categoryName}/${post.media.mediaName}`} alt="#"/>
                            </div>
                            <div className={"click_evt"}>
                                <img className={"nav-img"} src={like} alt={"좋아요"}/>
                                <img className={"nav-img"} src={comment} alt={"댓글"}/>
                                <img className={"nav-img"} src={sub} alt={"북마크"}/>
                                <div className={"content"}>내용</div>
                            </div>
                        </div>
                    ))}
                </div>
            </GalleryContainer>
        </div>
    );
};

export default BoardList;
