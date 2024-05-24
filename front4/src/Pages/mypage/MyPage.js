import React, { useEffect, useRef, useState } from "react";
import "./css/MyPage.scss";
import { MAIN_DATA } from "./MainData";
import First from "./Number/First";
import Second from "./Number/Second";
import LikeList from "./Number/LikeList";
import BookList from "./Number/BookList";
import styled from "styled-components";
import axiosInstance from "../../axiosInstance";

function MyPage() {
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기 URL을 위한 상태
    const fileInput = useRef(null);
    const [content, setContent] = useState();
    const [userId, setUserId] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [friendsList, setFriendsList] = useState([]);
    const userNick = localStorage.getItem('userNick');

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const storedUsername = localStorage.getItem("id");
        if (token) {
            setIsLoggedIn(true);
            if (storedUsername) {
                console.log(storedUsername);
                setUserId(storedUsername);

                axiosInstance.get(`/profile/${storedUsername}`) // axiosInstance 사용
                    .then(response => {
                        setProfileImage(response.data.userProfile);
                    })
                    .catch(error => console.error("Failed to load profile image", error));
            }
        }
    }, [profileImage]);

    // 파일 업로드 처리
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
            setPreviewImage(null); // 업로드 후 미리보기 이미지 제거
            setSelectedFile(null);
        } catch (error) {
            // 서버로부터의 응답이 에러일 경우 (예: 파일이 이미 존재하는 경우)
            console.error('Profile image update failed', error);

            // 서버가 '파일이 이미 존재합니다'와 같은 특정 에러 메시지를 반환하는 경우 사용자에게 경고창을 띄움
            if (error.response && error.response.data && error.response.data.message === "파일이 이미 존재합니다") {
                alert("이미 존재하는 프로필입니다. 다른 사진을 선택해주세요.");
            } else {
                // 다른 종류의 에러 메시지를 받은 경우, 일반적인 에러 처리
                alert("이미 존재하는 프로필입니다.");
                setPreviewImage(null);
                setSelectedFile(null);
            }
        }
    };

    // 파일 선택 처리 및 미리보기 생성
    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file)); // 미리보기 URL 생성 및 상태 업데이트
        }
    };

    const handleButtonClick = () => {
        fileInput.current.click();
    };

    const handleClickButton = e => {
        const { name } = e.target;
        setContent(name);
        console.log(e.target)
    };

    const selectComponent = {
        first: <First />,
        second: <Second />,
        third: <LikeList />,
        fourth: <BookList />,
    };

    return (
        <>
            <div className={"main-myPage"}>
                <div className={"myPro_file"}>
                    <div className={"pro-image"}>
                        {/* 미리보기 이미지가 있으면 미리보기 이미지를, 없으면 기존 프로필 이미지를 보여줍니다 */}
                        <img src={previewImage || profileImage} alt="Profile" className="profile-img" />
                        <button onClick={handleButtonClick} className={"img_btn"}>사진 선택</button>
                        {selectedFile && <button onClick={handleFileUpload} className={"img_btn"}>사진 수정</button>}
                    </div>
                    <input type={"file"} onChange={handleChange} ref={fileInput} style={{ display: "none" }} />
                    <h3>{userNick}</h3>
                    <div className={"my-pageNav"}>
                        {MAIN_DATA.map(data => (
                            <Button onClick={handleClickButton} name={data.name} key={data.id}>
                                {data.text}
                            </Button>
                        ))}
                        {content && selectComponent[content] ?
                            <div>{selectComponent[content]}</div>:
                            <First />
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
export default MyPage;

const Button = styled.button`
    height: 20px;
    color: #111111;
    background-color: #eeeeee;
    border-radius: 2rem;
`;