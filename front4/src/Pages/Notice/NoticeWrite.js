import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NoticeWrite = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const navigate = useNavigate();
    const id = localStorage.getItem('id');
    const accessToken = localStorage.getItem("accessToken");

    const [Notice, setNotice] = useState({
        title: '',  //제목
        content: '', // 그냥 내용
        tags: '',
        share: 'PUBLIC',
        type: 'NOTICE',
        writer: id
    });

    const { title, content, tags } = Notice;

    const onChange = (event) => {
        const { value, name } = event.target;
        setNotice({
            ...Notice,
            [name]: value,
        });
    };

    const saveNotice = async () => {
        try {
            await axios.post(`${SERVER_IP}/api/adminBoard`, {
                title: Notice.title,
                content: Notice.content,
                tags: Notice.tags,
                share: Notice.share,
                type: Notice.type,
                writerId: Notice.writer
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
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
        <div className="min-h-screen flex items-center justify-center bg-pink-100">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-2xl mt-10">
                <h2 className="text-2xl font-bold mb-6 text-center">공지사항 작성</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700">제목</label>
                        <input
                            type="text"
                            name="title"
                            value={title}
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
                            value={content}
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
                            value={tags}
                            onChange={onChange}
                            placeholder="태그를 입력해주세요"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                        ></textarea>
                    </div>
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={saveNotice}
                            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-200"
                        >
                            저장
                        </button>
                        <button
                            onClick={backToList}
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

export default NoticeWrite;
