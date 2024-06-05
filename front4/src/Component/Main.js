import React, { useEffect, useRef, useState } from 'react';
import './css/main.scss';
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

    //포즈 사진 효과
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

    // 프레임 사진 효과
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

    // 글씨 이벤트
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

    const searchContent = () => {
        navigate(`/event?keyword=#event`);
    };

    return (
        <div>
            <div className="mainBar">
                <li className="mainMenu left1"><Link to={"/Notice"} className={"main_nav"}>공지사항</Link></li>
                <li className="mainMenu right1"><button onClick={searchContent} className={"main_nav"}>이벤트</button></li>
            </div>

            <div className="main_first">
                <div className="first_left">
                    <ScrollAnimation>
                        <img src={Mainlogo} className={"main_logo"} alt={"메인로고"} />
                    </ScrollAnimation>
                </div>
                <ScrollAnimation className={"font_font"}>
                    <div ref={textRef} className={isVisible2 ? "first_right" : ""}>
                        간단하게 스캔하여 저장하자!! <br />네컷앨범을 사용해 보세요
                    </div>
                </ScrollAnimation>
            </div>
            <p className={"font_font"}>르세라핌과 사진 콜라보 이벤트!!</p>
            <div className={"third_div"}>
                <div>
                    <img className={"event_div"} src="/main_img/event.png" alt="이벤트 이미지" />
                </div>
            </div>
            <p className="font_font">요즘은 사진을 어떻게 찍을까?</p>
            <div className="main_div">
                {boardList.map((board) => (
                    <div className="third" key={board.id}>
                        <img className={isVisible1 ? "frame-in1" : "frame-out1"} src={`./images/${board.writerId}/${board.media.categoryName}/${board.media.mediaName}`} alt={"프레임1"} ref={imageRef1} />
                    </div>
                ))}
            </div>
            <p className="font_font">내가 만든 포즈 한번봐줘!</p>
            <div className="main_div">
                {poseList.map((board) => (
                    <div className="third" key={board.id}>
                        <img className={isVisible1 ? "frame-in1" : "frame-out1"} src={`./images/${board.writerId}/${board.media.categoryName}/${board.media.mediaName}`} alt={"프레임1"} ref={imageRef1} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;