import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WritePage = () => {
    const navigate = useNavigate();
    const fileInput = React.useRef(null);
    const id = localStorage.getItem('id');
    const accessToken = localStorage.getItem("accessToken");

    const [Notice, setNotice] = useState({
        title: '',  //제목
        content: '', // 그냥 내용
        tags: '',
        share: 'PUBLIC',
        type: 'NOTICE',
        writer:id
    });

    const { title, content, tags } = Notice;
    /*createdAt 추가 필요*/
    /*createdBy 로그인 관리자계정 아이디 확인 필요*/
    /*fileUrl 추가 필요*/

    const onChange = (event) => {
        const { value, name } = event.target;
        setNotice({
            ...Notice,
            [name]: value,
        });
    };

    const saveNotice = async () => {
        try {
            await axios.post(`http://localhost:8080/api/adminBoard`, {
                title:Notice.title,
                content:Notice.content,
                tags:Notice.tags,
                share:Notice.share,
                type: Notice.type,
                writerId: Notice.writer
            }, {
                headers: {
                    Authorization : `Bearer ${accessToken}`
                }
            }).then(() => {
                alert('등록완료');
                navigate('/Notice');
            })
        } catch (error) {
            console.error('공지사항 저장 실패:', error);
        }
    };

    const backToList = () => {
        navigate('/Notice');
    };

    return (
        <div>
            <div className='container'>
                <div>
                    <span>제목</span>
                    <input id='title_input' type="text" name="title" value={title} onChange={onChange}
                           placeholder='제목입력'/>
                </div>
                <br/>
                <div>
                    <span>내용</span><br/>
                    <textarea id='contents_area'
                              name="content"
                              cols="30"
                              rows="10"
                              value={content}
                              onChange={onChange}
                              placeholder='내용을 입력해주세요'
                    ></textarea>
                </div>
                <div>
                    <span>태그</span><br/>
                    <textarea id='contents_area'
                              name="tags"
                              cols="10"
                              rows="5"
                              value={tags}
                              onChange={onChange}
                              placeholder='태그를 입력해주세요'
                    ></textarea>
                </div>
            </div>
            <br/>
            <br/>
            <div>
                <button id='cancle_save_btn' onClick={saveNotice}>저장</button>
                <button id='cancle_save_btn' onClick={backToList}>취소</button>
            </div>
        </div>
    );
};

export default WritePage;
