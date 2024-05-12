import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BoardModify = () => {
    const { id } = useParams(); // URL에서 게시물 ID 가져오기
    const [title, setTitle] = useState(""); // 게시물 제목 상태
    const [content, setContent] = useState(""); // 게시물 내용 상태
    const [tag,setTag]=useState("");
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
                console.log(resp.data);
                setSelectedPost(resp.data);
                setTitle(resp.data.title); // 게시물 제목 설정
                setTag(resp.data.tags)
                setContent(resp.data.content); // 게시물 내용 설정
            } catch (error) {
                console.error("Error fetching board list:", error);
            }
        };
        fetchPost();
    }, [id, accessToken]);

    // 수정 내용 저장
    const handleSave = async () => {
        try {
            // 변경된 제목과 내용을 서버에 전송
            await axios.post(`http://localhost:8080/api/board/${id}`, { title, content,tag });
            // 수정이 완료되면 리다이렉션
            navigate(`/board`);
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    return (
        <div>
            <h2>게시물 수정하기</h2>
            {/* 수정 폼 구성 */}
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSave(); // 수정 내용 저장
            }}>
                {selectedPost && (
                    <div>
                        <p>제목: {selectedPost.title}</p>
                        {/* 게시물 이미지 표시 */}
                        {selectedPost.media.map((media, index) => (
                            <img
                                key={index}
                                className={"detail_img"}
                                src={`./images/${selectedPost.writerId}/${media.categoryName}/${media.mediaName}`}
                                alt={`사진 ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* 제목 입력 필드 */}
                <p>제목:<input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/></p>
                <p>태그:<input type="text" value={tag} onChange={(e) => setTag(e.target.value)}/></p>
                {/* 내용 입력 필드 */}
                <p>내용:<textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea></p>
                <button type="submit">수정 완료</button>
            </form>
        </div>
    );
};

export default BoardModify;
