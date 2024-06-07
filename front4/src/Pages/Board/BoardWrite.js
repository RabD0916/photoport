import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import plus from "../../img/plus.png";

const BoardWrite = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();
    const [key, setKey] = useState([]);
    const [value, setValue] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [galleryData, setGalleryData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [media, setMedia] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    const open_gal = async () => {
        try {
            const result = await axios.get(`${SERVER_IP}/api/sendCategory/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setGalleryData(result.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching gallery data:", error);
        }
    };

    const close_board = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        setSelectedImages([]);
    };

    const selectCategory = async (category) => {
        try {
            const result = await axios.get(`${SERVER_IP}/api/sendMedia/${category.name}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setMedia(result.data);
            setSelectedCategory(category);
        } catch (error) {
            console.error("Error fetching media data:", error);
        }
    };

    const addSelectedImagesToPost = () => {
        const newKeys = selectedImages.map(image => selectedCategory.name);
        const newValues = selectedImages.map(image => image.mediaName);
        setKey([...key, ...newKeys]);
        setValue([...value, ...newValues]);
        close_board();
    };

    const handleImageClick = (image) => {
        if (selectedImages.includes(image)) {
            setSelectedImages(selectedImages.filter(img => img !== image));
        } else {
            setSelectedImages([...selectedImages, image]);
        }
    };

    const [board, setBoard] = useState({
        title: '',
        content: '',
        fileName: [],
        tags: '',
        share: 'FRIEND',
        type: 'NORMAL',
        writer: userId
    });

    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const onChange = (event) => {
        const { value, name } = event.target;
        setBoard({
            ...board,
            [name]: value,
        });
    };

    const handleMessage = (event) => {
        if (typeof event.data === 'object' && event.data[0] !== undefined && event.data[1] !== undefined) {
            const newData = event.data[1];
            const newKeys = newData.map((item) => event.data[0]);
            setKey(prevKey => [...prevKey, ...newKeys]);
            setValue(prevValue => [...prevValue, ...newData]);
            setBoard({
                ...board,
                ["fileName"]: value,
            });
        }
    };

    const { title, tags, content } = board;

    const saveBoard = async () => {
        if (value[0] === null || value[0] === undefined || value[0] === '') {
            alert('사진을 추가해 주세요!');
            return;
        }

        await axios.post(`${SERVER_IP}/api/normalBoard`, {
            title: board.title,
            content: board.content,
            categories: key,
            mediaNames: value,
            tags: board.tags,
            share: board.share,
            type: board.type,
            writerId: board.writer
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((res) => {
            alert('등록되었습니다.');
            navigate('/board');
        });
    };

    const go_back = () => {
        navigate('/board');
    };

    const remove_index = (index) => {
        const newKey = [...key.slice(0, index), ...key.slice(index + 1)];
        const newValue = [...value.slice(0, index), ...value.slice(index + 1)];
        setKey(newKey);
        setValue(newValue);
    };

    return (
        <div className="bg-white shadow p-4 py-8">
            <div className="heading text-center font-bold text-2xl m-5 text-gray-800 bg-white">New Post</div>
            <div className="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl">
                <div className={"my-4 flex"}>
                    <div className={"editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl"}>
                        <input type="text" name="title" value={title} onChange={onChange} placeholder={"Title"}
                               className={"title bg-gray-100 border border-gray-300 p-2 mb-4 outline-none"} />
                        <textarea name={"content"}
                                  className="description bg-gray-100 sec p-3 h-auto border border-gray-300 outline-none mb-10"
                                  placeholder="Content" rows={10} value={content} onChange={onChange}></textarea>
                        <input type="text"
                               name="tags"
                               className="description bg-gray-100 sec p-3 h-auto border border-gray-300 outline-none"
                               placeholder="#Tag" value={tags} onChange={onChange}></input>
                    </div>
                </div>
                <button className="icons flex text-gray-500 m-2" onClick={open_gal}>
                    <img className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" alt={"사진추가"} src={plus} />
                </button>
                <div className="my-4 flex justify-center">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {key.map((item, index) => (
                            <div className="relative w-32 h-32 object-cover rounded" key={index}>
                                <img
                                    className="w-32 h-32 object-cover rounded"
                                    src={`/images/${userId}/${item}/${value[index]}`}
                                    alt={item}
                                />
                                <button
                                    onClick={() => remove_index(index)}
                                    className="w-6 h-6 absolute text-center flex items-center top-0 right-0 m-2 text-white text-lg bg-red-500 hover:text-red-700 hover:bg-gray-100 rounded-full p-1"
                                >
                                    <span className="mx-auto">×</span>
                                </button>
                                <div className="text-xs text-center p-2"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <button
                        className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500"
                        onClick={saveBoard}>글쓰기
                    </button>
                    <button
                        className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500"
                        onClick={go_back}>취소
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-4 rounded shadow-lg max-w-4xl w-full h-auto mx-4 my-4">
                        <h2 className="text-xl font-bold mb-4">Gallery</h2>
                        <div className="grid grid-cols-5 gap-4 justify-center">
                            {!selectedCategory ? (
                                galleryData.map((category, index) => (
                                    <div key={index} className="relative cursor-pointer" onClick={() => selectCategory(category)}>
                                        {category.thumbnail !== "Empty" ? (
                                            <img src={`/images/${userId}/${category.name}/${category.thumbnail}`} alt={category.name} className="w-full h-40 object-cover rounded" />
                                        ) : (
                                            <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded">
                                                <span className="text-gray-500">No Image</span>
                                            </div>
                                        )}
                                        <div className="px-2 py-1 absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center text-xs">
                                            {decodeURI(decodeURIComponent(category.name.replaceAll("&", "%")))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="col-span-3 grid grid-cols-3 gap-4 justify-center">
                                        {selectedImages.map((image, index) => (
                                            <img key={index} src={`/images/${userId}/${selectedCategory.name}/${image.mediaName}`} alt={`selected ${index}`} className="w-full h-40 object-cover rounded" />
                                        ))}
                                    </div>
                                    <div className="col-span-3 grid grid-cols-3 gap-4 mt-4 justify-center">
                                        {media.map((image, index) => (
                                            <div key={index} className="relative cursor-pointer" onClick={() => handleImageClick(image)}>
                                                <img src={`/images/${userId}/${selectedCategory.name}/${image.mediaName}`} alt={`image ${index}`} className={`w-full h-40 object-cover rounded ${selectedImages.includes(image) ? 'border-4 border-blue-500' : ''}`} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-span-3 flex justify-center mt-4 space-x-4">
                                        <button onClick={() => setSelectedCategory(null)} className="px-4 py-2 bg-blue-500 text-white rounded">Back to Categories</button>
                                        <button onClick={addSelectedImagesToPost} className="px-4 py-2 bg-green-500 text-white rounded">사진 선택</button>
                                    </div>
                                </>
                            )}
                        </div>
                        <button onClick={close_board} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BoardWrite;
