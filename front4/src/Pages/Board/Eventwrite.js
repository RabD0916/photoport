import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventWrite = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [board, setBoard] = useState({
        title: '',
        content: '',
        fileName: [],
        tags: '',
        share: 'PUBLIC',
        type: 'EVENT',
        categories: ['event'],
        writerId: userId
    });

    const handleFileSelect = (event) => {
        if (event.target.files.length > 4) {
            alert('사진은 최대 4개까지 업로드 가능합니다.');
            return;
        }

        const filesArray = Array.from(event.target.files);
        if (filesArray.length === 0) {
            alert('파일을 선택해주세요.');
            return;
        }
        setSelectedFiles(filesArray);
        const fileNames = filesArray.map(file => file.name);
        const categories = Array(filesArray.length).fill('event');

        setBoard({
            ...board,
            mediaNames: fileNames,
            categories: categories,
        });
    };

    const onChange = (event) => {
        const { value, name } = event.target;
        setBoard({
            ...board,
            [name]: value,
        });
    };

    const saveBoard = async () => {
        const formData = new FormData();
        formData.append('dto', new Blob([JSON.stringify(board)], { type: "application/json" }));
        selectedFiles.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await axios.post(`${SERVER_IP}/api/eventBoard`, formData, {
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

    const removeIndex = (index) => {
        const newSelectedFiles = [...selectedFiles.slice(0, index), ...selectedFiles.slice(index + 1)];
        setSelectedFiles(newSelectedFiles);
        const newFileNames = newSelectedFiles.map(file => file.name);
        const newCategories = Array(newSelectedFiles.length).fill('event');

        setBoard({
            ...board,
            mediaNames: newFileNames,
            categories: newCategories,
        });
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
                <div className="my-4 flex justify-center">
                    <input type="file" multiple onChange={handleFileSelect} accept="image/*" className="mb-4" />
                </div>
                <div className="my-4 flex justify-center">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {selectedFiles.map((file, index) => (
                            <div className="relative w-32 h-32 object-cover rounded" key={index}>
                                <img
                                    className="w-32 h-32 object-cover rounded"
                                    src={URL.createObjectURL(file)}
                                    alt={`Selected ${index}`}
                                />
                                <button
                                    onClick={() => removeIndex(index)}
                                    className="w-6 h-6 absolute text-center flex items-center top-0 right-0 m-2 text-white text-lg bg-red-500 hover:text-red-700 hover:bg-gray-100 rounded-full p-1"
                                >
                                    <span className="mx-auto">×</span>
                                </button>
                                <div className="text-xs text-center p-2"></div>
                            </div>
                        ))}
                    </div>
                </div>
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