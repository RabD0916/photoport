import React, { useEffect, useRef, useState } from "react";
import { MAIN_DATA } from "./MainData";
import First from "./Number/First";
import Second from "./Number/Second";
import LikeList from "./Number/LikeList";
import BookList from "./Number/BookList";
import axiosInstance from "../../axiosInstance";

function MyPage() {
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInput = useRef(null);
    const [content, setContent] = useState();
    const [userId, setUserId] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const userNick = localStorage.getItem('userNick');

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const storedUsername = localStorage.getItem("id");
        if (token) {
            setIsLoggedIn(true);
            if (storedUsername) {
                setUserId(storedUsername);

                axiosInstance.get(`/profile/${storedUsername}`)
                    .then(response => {
                        setProfileImage(response.data.userProfile);
                    })
                    .catch(error => console.error("Failed to load profile image", error));
            }
        }
    }, [profileImage]);

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('userId', userId);

        try {
            const response = await axiosInstance.post(`/profileUpdate/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProfileImage(response.data.userProfile);
            setPreviewImage(null);
            setSelectedFile(null);
        } catch (error) {
            console.error('Profile image update failed', error);

            if (error.response && error.response.data && error.response.data.message === "파일이 이미 존재합니다") {
                alert("이미 존재하는 프로필입니다. 다른 사진을 선택해주세요.");
            } else {
                alert("이미 존재하는 프로필입니다.");
                setPreviewImage(null);
                setSelectedFile(null);
            }
        }
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleButtonClick = () => {
        fileInput.current.click();
    };

    const handleClickButton = e => {
        const { name } = e.target;
        setContent(name);
    };

    const selectComponent = {
        first: <First />,
        second: <Second />,
        third: <LikeList />,
        fourth: <BookList />,
    };

    return (
        <>
            <div className="bg-white">
                <div className="pt-6">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <img src={previewImage || profileImage} alt="Profile"
                                 className="inline-block h-32 w-32 rounded-full ring-2 ring-white mb-4"/>
                            <button onClick={handleButtonClick}
                                    className="absolute bottom-0 right-0 bg-blue-500 text-white text-sm p-1 rounded-full">사진 선택</button>
                            {selectedFile && <button onClick={handleFileUpload}
                                                     className="absolute bottom-0 left-0 bg-green-500 text-white text-sm p-1 rounded-full">사진 수정</button>}
                        </div>
                        <input type="file" onChange={handleChange} ref={fileInput} className="hidden"/>
                        <h3 className="text-xl font-semibold mb-4">{userNick}</h3>
                        <div className="flex space-x-2">
                            {MAIN_DATA.map(data => (
                                <button key={data.id} name={data.name} onClick={handleClickButton}
                                        className="py-2 px-4 bg-gray-200 text-black rounded-md shadow-md hover:bg-gray-300">
                                    {data.text}
                                </button>
                            ))}
                        </div>
                        <div className="mt-6">
                            {content && selectComponent[content] ? selectComponent[content] : <First />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyPage;
