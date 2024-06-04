import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const NoticeUpdate = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const navigate = useNavigate();
    const { id } = useParams();
    const accessToken = localStorage.getItem("accessToken");
    const [notice, setNotice] = useState({
        title: '',
        content: '',
        tags: ''
    });

    // 기존 게시글 데이터를 불러오는 함수
    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await axios.get(`${SERVER_IP}/api/board/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const { title, content, tags } = response.data;
                setNotice({
                    title,
                    content,
                    tags: tags.join(', ') // 배열로 되어있는 태그를 쉼표로 구분된 문자열로 변환
                });
            } catch (error) {
                console.error('Failed to fetch notice:', error);
            }
        };

        fetchNotice();
    }, [id, accessToken]); // id나 accessToken이 변경되면 함수 재실행

    const onChange = (event) => {
        const { name, value } = event.target;
        setNotice(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateNotice = async () => {
        try {
            const response = await axios.post(`${SERVER_IP}/api/update/board/${id}`, notice, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.status === 200) {
                alert("업데이트 완료.");
                navigate(`/Notice/${id}`);
            }
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const backToDetail = () => {
        navigate(`/Notice/${id}`);
    };

    return (
        <div>
            <div>
                <span>제목</span>
                <input type="text" name="title" value={notice.title} onChange={onChange}/>
            </div>
            <br/>
            <br/>
            <div>
                <span>내용</span>
                <textarea name="content" cols="30" rows="10" value={notice.content} onChange={onChange}></textarea>
            </div>
            <div>
                <span>태그</span>
                <textarea name="tags" cols="30" rows="10" value={notice.tags} onChange={onChange}></textarea>
            </div>
            <br/>
            <div>
                <button onClick={updateNotice}>수정</button>
                <button onClick={backToDetail}>취소</button>
            </div>
        </div>
    );
};

export default NoticeUpdate;
