import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NoticeShow from './NoticeShow';

const NoticeDetail = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState({});
    const accessToken = localStorage.getItem("accessToken");

    const getNotice = async () => {
        try {
            const resp = await axios.get(`http://localhost:8080/api/board/${id}`, {
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

    useEffect(() => {
        getNotice();
    }, [id]); // id 값이 변경될 때마다 getNotice 함수를 호출

    return (
        <div>
            {loading ? (
                <h2>Loading...</h2>
            ) : (
                <NoticeShow
                    idx={notice.id}
                    title={notice.title}
                    contents={notice.content}
                    createdBy={notice.writerId}
                    tags={notice.tags}
                    createdAt={notice.createdAt}
                />
            )}
        </div>
    );
};

export default NoticeDetail;