import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventWrite = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();
    const [board, setBoard] = useState({
        title: '',
        content: '',
        tags: '',
        share: 'PUBLIC',
        type: 'EVENT',
        writerId: userId
    });

    const onChange = (event) => {
        const { value, name } = event.target;
        setBoard({
            ...board,
            [name]: value,
        });
    };

    const saveBoard = async () => {
        try {
            const response = await axios.post(`${SERVER_IP}/api/eventBoard`, board, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            alert('등록되었습니다.');
            navigate('/EventList');
        } catch (error) {
            alert("관리자가 개최한 이벤트가 없습니다");
            console.error('등록에 실패했습니다.', error);
        }
    };

    const goBack = () => {
        navigate('/EventList');
    };

    const { title, tags, content } = board;

    return (
        <div className="bg-main-image shadow p-4 py-8">
            <div className="heading text-center font-bold text-2xl m-5 text-gray-800 bg-white">New Event</div>
            <div className="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl">
                <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={onChange}
                    placeholder="Title"
                    className="title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"
                />
                <textarea
                    name="content"
                    className="description bg-gray-100 sec p-3 h-auto border border-gray-300 outline-none mb-10"
                    placeholder="Content"
                    rows={10}
                    value={content}
                    onChange={onChange}
                ></textarea>
                <input
                    type="text"
                    name="tags"
                    className="description bg-gray-100 sec p-3 h-auto border border-gray-300 outline-none"
                    placeholder="#Tag"
                    value={tags}
                    onChange={onChange}
                />
                <div className="mt-4 flex justify-end">
                    <button
                        className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500"
                        onClick={saveBoard}
                    >
                        등록
                    </button>
                    <button
                        className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500"
                        onClick={goBack}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventWrite;
