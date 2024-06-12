import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const { id } = useParams();
    const userId = localStorage.getItem("id");
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState({});
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const getEvent = async () => {
        try {
            const resp = await axios.get(`${SERVER_IP}/api/board/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // 날짜 포매팅
            const date = new Date(...resp.data.createdAt);
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

            // 데이터 세팅
            setEvent({
                ...resp.data,
                createdAt: formattedDate,
                tags: resp.data.tags.filter(tag => tag).join(', ') // 빈 문자열 제거 후 문자열로 변환
            });
            setLoading(false);
        } catch (error) {
            console.error('이벤트 불러오기 실패 : ', error);
        }
    };

    const moveToUpdate = () => {
        navigate('/EventUpdate/' + id);
    };

    const deleteEvent = async () => {
        try {
            const response = await axios.delete(`${SERVER_IP}/api/delete/board/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("Event deleted:", response);
            // 게시글 삭제 후 모달 닫기 및 게시글 목록 새로고침
            alert("해당 이벤트가 삭제되었습니다.")
            navigate('/EventList');
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    const moveToList = () => {
        navigate('/EventList');
    };

    useEffect(() => {
        getEvent();
    }, [id]); // id 값이 변경될 때마다 getEvent 함수를 호출

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="container mt-5 px-2 w-4/5 h-auto bg-white overflow-auto rounded-2xl mx-auto">
                {loading ? (
                    <h2 className="text-2xl font-semibold text-center">Loading...</h2>
                ) : (
                    <div className="p-6">
                        <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
                        <h5 className="text-xl mb-2">작성자: {event.writerId}</h5>
                        <p className="mb-4">작성 일자: {event.createdAt}</p>
                        <hr className="my-4 border-gray-300"/>
                        <p className="mb-4">{event.content}</p>
                        <hr className="my-4 border-gray-300"/>
                        <p className="mb-4">태그: {event.tags}</p>
                        <hr className="my-4 border-gray-300"/>
                        {userId === event.writerId && (
                            <div className="flex justify-between">
                                <button
                                    onClick={moveToUpdate}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={deleteEvent}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                        <button
                            onClick={moveToList}
                            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            목록
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetail;