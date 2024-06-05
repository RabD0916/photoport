import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BoardCss/BoardWrite.scss";

const PoseWrite = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]); // 선택된 파일 상태
    const settings = {
        dots: true,
        fade: true,
        arrows: false,       // 옆으로 이동하는 화살표 표시 여부
        infinite: true,
        draggable: true,     // 드래그 가능 여부
        speed: 100,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [ // 반응형 웹 구현 옵션
            {
                breakpoint: 960, //화면 사이즈 960px일 때
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768, //화면 사이즈 768px일 때
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    };
    const [board, setBoard] = useState({
        title: '',
        content: '',
        fileName: [],
        tags: '',
        share: 'PUBLIC',
        type: 'POSE',
        categories: ['pose'], // 'pose' 문자열을 배열로 감싸줍니다.
        writerId: userId
    });

    // 파일 선택 핸들러
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
        // 파일 이름을 state에 저장
        const fileNames = filesArray.map(file => file.name);

        // 파일 개수에 맞게 categories 배열 생성
        const categories = Array(filesArray.length).fill('pose');

        setBoard({
            ...board,
            mediaNames: fileNames, // 'fileName'을 'mediaNames'로 변경
            categories: categories, // 동적으로 업데이트된 categories 배열 사용
        });
    };

    const onChange = (event) => {
        const { value, name } = event.target; //event.target에서 name과 value만 가져오기
        setBoard({
            ...board,
            [name]: value,
        });
    };

    const { title, tags, content } = board; // 비구조화 할당
    console.log(board)
    const saveBoard = async () => {
        const formData = new FormData();

        // 게시글 데이터 추가
        formData.append('dto', new Blob([JSON.stringify(board)], { type: "application/json" }));
        // 선택된 파일들을 formData에 추가
        selectedFiles.forEach((file, index) => {
            formData.append(`files`, file); // 'files'는 서버에서 기대하는 파트(name)입니다.
        });
        console.log(formData)
        try {
            const response = await axios.post(`${SERVER_IP}/api/poseBoard`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    // 'Content-Type'을 명시적으로 설정하지 않습니다.
                    // Axios가 자동으로 'multipart/form-data'로 설정하기 때문입니다.
                },
            });
            alert('등록되었습니다.');
            navigate('/Pose');
        } catch (error) {
            console.error('등록에 실패했습니다.', error);
        }
    };

    const go_back = () => {
        navigate('/board');
    };

    return (
        <div className="center-align">
            <div className="big-font">
                <div className={"content_div"}>
                    <span className={"p_name"}>사진</span>
                    <input type="file" multiple onChange={handleFileSelect} accept="image/*"/>
                    <span>제목</span>
                    <input type="text" name="title" value={title} onChange={onChange}/>
                    <br/>
                    <span>태그</span>
                    <input
                        type="text"
                        name="tags"
                        value={tags}
                        onChange={onChange}
                    />
                    <br/>
                    <span>내용</span>
                    <textarea className="text_area"
                              name="content"
                              value={content}
                              onChange={onChange}
                    />
                    <br/>
                </div>
                <div>
                    <button className="button-style" onClick={saveBoard}>글쓰기</button>
                    <button className="button-style" onClick={go_back}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default PoseWrite;