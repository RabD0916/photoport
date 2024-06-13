import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const NoticeDetail = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const { id } = useParams();
    const userId = localStorage.getItem("id");
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState({});
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const getNotice = async () => {
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
            setNotice({
                ...resp.data,
                createdAt: formattedDate,
                tags: resp.data.tags.filter(tag => tag).join(', ') // 빈 문자열 제거 후 문자열로 변환
            });
            setLoading(false);
        } catch (error) {
            console.error('공지사항 불러오기 실패 : ', error);
        }
    };

    const moveToUpdate = () => {
        navigate('/update/' + id);
    };

    const deleteNotice = async () => {
        try {
            const response = await axios.delete(`${SERVER_IP}/api/delete/board/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("Post deleted:", response);
            alert("해당 게시글이 삭제되었습니다.");
            navigate('/Notice');
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const moveToList = () => {
        navigate('/Notice');
    };

    useEffect(() => {
        getNotice();
    }, [id]);

    return (
        <div className="min-h-screen bg-pink-100 p-4 flex items-center justify-center">
            {loading ? (
                <h2 className="text-2xl font-bold">Loading...</h2>
            ) : (
                <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-2xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{notice.title}</h2>
                    <div className="text-gray-700 mb-4">
                        <p className="text-lg">작성자: {notice.writerId}</p>
                        <p className="text-sm text
-gray-500">작성 일자: {notice.createdAt}</p>
                    </div>
                    <hr className="my-4"/>
                    <div className="text-gray-700 mb-4">
                        <p className="text-lg">{notice.content}</p>
                    </div>
                    <hr className="my-4"/>
                    <div className="text-gray-700 mb-4">
                        <p className="text-sm">태그: {notice.tags}</p>
                    </div>
                    {userId === "ADMIN" && (
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                                onClick={moveToUpdate}
                            >
                                수정
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                                onClick={deleteNotice}
                            >
                                삭제
                            </button>
                        </div>
                    )}
                    <div className="flex justify-end mt-4">
                        <button
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                            onClick={moveToList}
                        >
                            목록
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoticeDetail;
