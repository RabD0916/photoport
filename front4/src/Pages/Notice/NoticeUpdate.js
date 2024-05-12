import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Notice from "./Notice";

const NoticeUpdate = () =>{
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");
    const { id } = useParams();
    const [NoticeShow, setNotice] = useState({
        title: '',
        content: '',
        tags:''
    });

    const { title, content , tags} = NoticeShow; //비구조화 할당

    const onChange = (event) => {
        const { value, name } = event.target;
        setNotice({
            ...NoticeShow,
            [name]: value,
        });
    };

    const updateNotice = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/api/update/board/${id}`, NoticeShow, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            if (response.status === 200) {
                alert("업데이트 완료.");
                navigate('/Notice/' + id);
            }
        } catch (error) {
            console.error("update fail", error)
        }
    };

    const backToDetail = () => {
        navigate('/NoticeShow/' + id);
    };

    /* 이미지 삭제 및 재첨부 기능 추가*/

    return (
        <div>
            <div>
                <span>제목</span>
                <input type="text" name="title" value={title} onChange={onChange}/>
            </div>
            <br/>
            <br/>
            <div>
                <span>내용</span>
                <textarea
                    name="content"
                    cols="30"
                    rows="10"
                    value={content}
                    onChange={onChange}
                ></textarea>
            </div>
            <div>
                <span>태그</span>
                <textarea
                    name="tags"
                    cols="30"
                    rows="10"
                    value={tags}
                    onChange={onChange}
                ></textarea>
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