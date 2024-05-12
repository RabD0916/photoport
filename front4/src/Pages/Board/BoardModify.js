import React, { useState, useEffect } from "react";
import {useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./BoardCss/Modify.scss"

const BoardModify = () => {
    const userId = localStorage.getItem('id');
    const { id } = useParams(); // URL에서 게시물 ID 가져오기
    const [title, setTitle] = useState(""); // 게시물 제목 상태
    const [content, setContent] = useState(""); // 게시물 내용 상태
    const [tag, setTag] = useState(""); // 게시물 태그 상태
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");
    const [selectedPost, setSelectedPost] = useState(null);

    // 게시물 데이터 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const resp = await axios.get(`http://localhost:8080/api/board/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setSelectedPost(resp.data);
                setTitle(resp.data.title); // 게시물 제목 설정
                setContent(resp.data.content); // 게시물 내용 설정
                setTag(resp.data.tags); // 게시물 태그 설정
            } catch (error) {
                console.error("Error fetching board list:", error);
            }
        };
        fetchPost();
    }, [id, accessToken]);

    // 수정 내용 저장
    const handleSave = async () => {
        try {
            // 변경된 제목과 내용, 태그를 서버에 전송
            await axios.put(`http://localhost:8080/api/update/board/${id}`, { title, content, tags: tag }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // 수정이 완료되면 리다이렉션
            navigate(`/Mypage`);
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    return (
        <div>
            <h2>게시물 수정하기</h2>
            {/* 수정 폼 구성 */}
            <form className={"up-main"} onSubmit={(e) => {
                e.preventDefault();
                handleSave(); // 수정 내용 저장
            }}>

                <p className={"up-title"}>제목<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></p>
                <p className={"up-tag"}>태그<input type="text" placeholder={"#을 붙혀주세요"} value={tag} onChange={(e) => setTag(e.target.value)} /></p>
                <p className={"up-content"}>내용<textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea></p>
                <button type="submit">수정 완료</button>
            </form>
        </div>
    );
};

export default BoardModify;
