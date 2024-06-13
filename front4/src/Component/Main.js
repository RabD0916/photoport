import React, { useEffect, useRef, useState } from 'react';
import Mainlogo from '../img/photoport.png';
import { Link } from "react-router-dom";
import { ScrollAnimation } from "./ScrollAnimation";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Main = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [isVisible1, setIsVisible1] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const navigate = useNavigate();
    const imageRef1 = useRef(null);
    const imageRef2 = useRef(null);
    const textRef = useRef(null);
    const accessToken = localStorage.getItem("accessToken");
    const [poseList, setPoseList] = useState([]);
    const [boardList, setBoardList] = useState([]);

    useEffect(() => {
        const observer1 = new IntersectionObserver(
            ([entry]) => {
                setIsVisible1(entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            }
        );
        const currentImageRef1 = imageRef1.current;
        if (currentImageRef1) {
            observer1.observe(currentImageRef1);
        }

        return () => {
            if (currentImageRef1) {
                observer1.unobserve(currentImageRef1);
            }
        };
    }, [imageRef1]);

    useEffect(() => {
        const observer2 = new IntersectionObserver(
            ([entry]) => {
                setIsVisible2(entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            }
        );

        const currentImageRef2 = imageRef2.current;
        if (currentImageRef2) {
            observer2.observe(currentImageRef2);
        }

        return () => {
            if (currentImageRef2) {
                observer2.unobserve(currentImageRef2);
            }
        };
    }, [imageRef2]);

    useEffect(() => {
        const observer3 = new IntersectionObserver(
            ([entry]) => {
                setIsVisible2(entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            }
        );

        const currentTextRef = textRef.current;
        if (currentTextRef) {
            observer3.observe(currentTextRef);
        }

        return () => {
            if (currentTextRef) {
                observer3.unobserve(currentTextRef);
            }
        };
    }, [textRef]);

    const getBoardList = async () => {
        try {
            const resp = await axios.get(`${SERVER_IP}/api/top3/NORMAL`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setBoardList(resp.data);
        } catch (error) {
            console.error("Error fetching board list: ", error);
        }
    };

    useEffect(() => {
        getBoardList();
    }, []);

    const getPoseList = async () => {
        try {
            const resp = await axios.get(`${SERVER_IP}/api/top3/POSE`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setPoseList(resp.data);
        } catch (error) {
            console.error("Error fetching pose list: ", error);
        }
    };

    useEffect(() => {
        getPoseList();
    }, []);

    const checkLoginAndNavigate = (path) => {
        if (accessToken) {
            navigate(path);
        } else {
            alert('로그인이 필요합니다.');
            navigate('/login');
        }
    };

    return (
        <div className={"bg-pink-100"}>
            <div className="flex justify-center py-4 bg-white shadow-lg">
                <div className="flex space-x-8">
                    <button onClick={() => checkLoginAndNavigate('/Notice')} className="text-lg font-semibold text-gray-700">공지사항</button>
                    <button onClick={() => checkLoginAndNavigate('/EventList')} className="text-lg font-semibold text-gray-700">이벤트</button>
                </div>
            </div>
            <hr className="my-2 border-gray-300" />

            <div className="flex flex-col md:flex-row items-center justify-between mt-10 px-6">
                <div className="w-full md:w-1/2">
                    <ScrollAnimation>
                        <img src={Mainlogo} className="w-full md:w-1/2 mx-auto" alt="메인로고" />
                    </ScrollAnimation>
                </div>
                <ScrollAnimation className="font_font w-full md:w-1/2">
                    <div ref={textRef} className={`transition-opacity duration-1000 ${isVisible2 ? 'opacity-100' : 'opacity-0'}`}>
                        간단하게 스캔하여 저장하자!! <br />네컷앨범을 사용해 보세요
                    </div>
                </ScrollAnimation>
            </div>
            <p className="text-center text-xl font-semibold mt-10">르세라핌과 사진 콜라보 이벤트!!</p>
            <div className="flex justify-center my-10">
                <img className="w-full max-w-4xl" src="/main_img/event.png" alt="이벤트 이미지" />
            </div>
            <p className="text-center text-xl font-semibold">요즘은 사진을 어떻게 찍을까?</p>
            <div className="flex flex-wrap justify-center mt-6">
                {boardList.map((board) => (
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4" key={board.id}>
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <h3 className="text-lg font-semibold text-gray-800 p-4">{board.title}</h3>
                            <img
                                className={`transition-transform duration-500 ${isVisible1 ? 'transform scale-100' : 'transform scale-95'} w-full h-64 object-cover`}
                                src={`./images/${board.writerId}/${board.media.categoryName}/${board.media.mediaName}`}
                                alt="프레임1"
                                ref={imageRef1}
                            />
                            <div className="p-4">
                                <p className="text-sm text-gray-600">#{board.tags}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-center text-xl font-semibold mt-10">내가 만든 포즈 한번봐줘!</p>
            <div className="flex flex-wrap justify-center mt-6">
                {poseList.map((board) => (
                    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4" key={board.id}>
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <h3 className="text-lg font-semibold text-gray-800 p-4">{board.title}</h3>
                            <img
                                className={`transition-transform duration-500 ${isVisible1 ? 'transform scale-100' : 'transform scale-95'} w-full h-64 object-cover`}
                                src={`./images/${board.writerId}/${board.media.categoryName}/${board.media.mediaName}`}
                                alt="프레임1"
                                ref={imageRef1}
                            />
                            <div className="p-4">
                                <p className="text-sm text-gray-600">#{board.tags}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;
