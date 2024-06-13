import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EventUpdate = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const navigate = useNavigate();
    const { id } = useParams();
    const accessToken = localStorage.getItem("accessToken");
    const [Event, setEvent] = useState({
        title: '',
        content: '',
        tags: ''
    });

    // 기존 게시글 데이터를 불러오는 함수
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`${SERVER_IP}/api/board/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const { title, content, tags } = response.data;
                setEvent({
                    title,
                    content,
                    tags: tags.join(', ') // 배열로 되어있는 태그를 쉼표로 구분된 문자열로 변환
                });
            } catch (error) {
                console.error('Failed to fetch event:', error);
            }
        };

        fetchEvent();
    }, [id, accessToken]); // id나 accessToken이 변경되면 함수 재실행

    const onChange = (event) => {
        const { name, value } = event.target;
        setEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateNotice = async () => {
        try {
            const response = await axios.post(`${SERVER_IP}/api/update/board/${id}`, Event, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.status === 200) {
                alert("업데이트 완료.");
                navigate(`/Event/${id}`);
            }
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const backToDetail = () => {
        navigate(`/Event/${id}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-100">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center">공지사항 수정</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700">제목</label>
                        <input
                            type="text"
                            name="title"
                            value={Event.title}
                            onChange={onChange}
                            placeholder="제목입력"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">내용</label>
                        <textarea
                            name="content"
                            cols="30"
                            rows="10"
                            value={Event.content}
                            onChange={onChange}
                            placeholder="내용을 입력해주세요"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-700">태그</label>
                        <textarea
                            name="tags"
                            cols="10"
                            rows="5"
                            value={Event.tags}
                            onChange={onChange}
                            placeholder="태그를 입력해주세요"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        ></textarea>
                    </div>
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={updateNotice}
                            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-200"
                        >
                            수정
                        </button>
                        <button
                            onClick={backToDetail}
                            className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition duration-200"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventUpdate;
