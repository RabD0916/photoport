import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BoardModify = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const userId = localStorage.getItem('id');
    const { id } = useParams(); // URL에서 게시물 ID 가져오기
    const [title, setTitle] = useState(""); // 게시물 제목 상태
    const [content, setContent] = useState(""); // 게시물 내용 상태
    const [tag, setTag] = useState(""); // 게시물 태그 상태
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");
    const [selectedPost, setSelectedPost] = useState(null);
    const [board, setBoard] = useState({
        title: '',
        content: '',
        tags: ''
    })

    // 게시물 데이터 불러오기
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const resp = await axios.get(`${SERVER_IP}/api/board/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const { title, content, tags } = resp.data;
                setBoard({
                    title,
                    content,
                    tags: tags.join(', ')
                })
            } catch (error) {
                console.error("Error fetching board list:", error);
            }
        };
        fetchPost();
    }, [id, accessToken]);

    const onChange = (event) => {
        const { name, value } = event.target;
        setBoard(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 수정 내용 저장
    const handleSave = async () => {
        try {
            // 변경된 제목과 내용, 태그를 서버에 전송
            const response = await axios.post(`${SERVER_IP}/api/update/board/${id}`, board, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // 수정이 완료되면 리다이렉션
            if (response.status === 200) {
                alert("업데이트 완료");
                navigate(`/Mypage`);
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6">게시물 수정하기</h2>
            {/* 수정 폼 구성 */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">제목</label>
                <input
                    type="text"
                    name="title"
                    value={board.title}
                    onChange={onChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">내용</label>
                <textarea
                    name="content"
                    value={board.content}
                    onChange={onChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">태그</label>
                <input
                    name="tags"
                    placeholder="#을 붙혀주세요"
                    value={board.tags}
                    onChange={onChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                수정 완료
            </button>
        </div>
    );
};

export default BoardModify;
