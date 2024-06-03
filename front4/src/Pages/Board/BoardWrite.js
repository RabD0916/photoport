import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BoardCss/BoardWrite.scss"

const BoardWrite = () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();
    const [key, setKey] = useState([]);
    const [value, setValue] = useState([]);
    const settings = {
        dots: true,
        fade: true,
        arrows: false,
        infinite: true,
        draggable: true,
        speed: 100,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
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
        tags: '',  // 변수명 수정
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

    const { title, tags, content } = board; // 변수명 수정

    const saveBoard = async () => {
        if (value[0] === null || value[0] === undefined || value[0] === '') {
            alert('사진을 추가해 주세요!');
            return;
        }

        await axios.post(`http://localhost:8080/api/normalBoard`, {
            title: board.title,
            content: board.content,
            categories: key,
            mediaNames: value,
            tags: board.tags,  // 변수명 수정
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

    const backToList = () => {
        window.open("gallery/hidden/" + userId, "_blank", "width=100");
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
        <div className="center-align">
            <div className="big-font">
                <div className={"content_div"}>
                    <span className={"p_name"}>사진</span>
                    <div>
                        <Slider {...settings}>
                            {key.map((item, index) => (
                                <img
                                    key={index}
                                    src={"/images/" + userId + "/" + item + "/" + value[index]}
                                    alt={item}
                                    onClick={() => remove_index(index)}
                                />
                            ))}
                        </Slider>
                    </div>
                    <button className={"plus_button"} onClick={backToList}>사진추가</button>
                    <span>제목</span>
                    <input type="text" name="title" value={title} onChange={onChange} />
                    <br />
                    <span>태그</span>
                    <input
                        type="text"
                        name="tags"  // 변수명 수정
                        value={tags}
                        onChange={onChange}
                    />
                    <br />
                    <span>내용</span>
                    <textarea className="text_area"
                              name="content"
                              value={content}
                              onChange={onChange}
                    />
                    <br />
                </div>
                <div>
                    <button className="button-style" onClick={saveBoard}>글쓰기</button>
                    <button className="button-style" onClick={go_back}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default BoardWrite;