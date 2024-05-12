import React, { useEffect, useRef, useState } from 'react';
import './css/main.scss';
import Mainlogo from '../img/photoport.png';
import {Link} from "react-router-dom";
import { ScrollAnimation } from "./ScrollAnimation";
import axios from "axios";


const Main = () => {

    const [isVisible1, setIsVisible1] = useState(false); // 포즈 이벤트
    const [isVisible2, setIsVisible2] = useState(false); // 프레임 이벤트
    const imageRef1 = useRef(null); // 포즈
    const imageRef2 = useRef(null); //프레임
    const textRef = useRef(null);
    const accessToken = localStorage.getItem("accessToken");
    const [sortValue, setSortValue] = useState("like");        // Can use : title, createdAt, view, like, bookmark
    const [sortOrder, setSortOrder] = useState("desc");             // asc = ascending, desc = descending
    const [poseList, setPoseList] = useState([{
        id: null,
        title: null,
        createdAt: null,
        view: null,
        like: null,
        bookmark: null,
        writerId: null,
        writerName: null,
        media: {
            mediaName: null,
            categoryName: null
        },
        commentsDto: {
            id: null,
            content: null,
            writerId: null,
            writerName: null
        },
        tags: null
    }]);

    const [boardList, setBoardList] = useState([{
        id: null,
        title: null,
        createdAt: null,
        view: null,
        like: null,
        bookmark: null,
        writerId: null,
        writerName: null,
        media: {
            mediaName: null,
            categoryName: null
        },
        commentsDto: {
            id: null,
            content: null,
            writerId: null,
            writerName: null
        },
        tags: null
    }]);

    //포즈 사진 효과
    useEffect(() => {
        const observer1 = new IntersectionObserver(  //intersectionObserver은 화면 교차 감지 api
            ([entry]) => {    //콜백 함수 정의 매개변수 entry 선언 배열 비구조화
                setIsVisible1(entry.isIntersecting);            //isIntersecting 속성을 이용해서 화면에 요소가 보이는지 판단해서 setIsVisible1에 저장
            },
            {
                root: null,         //관찰하는 루트 요소
                rootMargin: '0px',  // 루트영역 조정하는 마진
                threshold: 0.5, // 요소의 50% 이상이 화면에 보일 때 감지  //교차영역 감지 비율
            }
        );
        const currentImageRef1 = imageRef1.current;
        if (currentImageRef1) {        //Ref개체가 현재 있으면 IntersectionObserver를 사용하여 관찰
            observer1.observe(currentImageRef1);
        }

        return () => {
            if (currentImageRef1) {        //useEffect 변환 함수 이벤트리스너 제거
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
                threshold: 0.5, // 요소의 50% 이상이 화면에 보일 때 감지
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
    //게시판 정렬
    const getBoardList = async () => {
        try {
            const resp = await axios.get(`http://localhost:8080/api/type/NORMAL/${sortValue}/${sortOrder}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp);
            setBoardList(resp.data);
        } catch (error) {
            console.error("Error board list: ", error);
        }
    };
    useEffect(() => {
        getBoardList();
    }, []);
    const getPoseList = async () => {
        try {
            const resp = await axios.get(`http://localhost:8080/api/type/POSE/${sortValue}/${sortOrder}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp);
            setPoseList(resp.data);
        } catch (error) {
            console.error("Error board list: ", error);
        }
    };
    useEffect(() => {
        getPoseList();
    }, []);
    return (
        <div>
            <div>
                <img className="center1" src="/backbaxk.jpg" alt="센터1"/>
            </div>
            <div className="mainBar">
                <li className="mainMenu left1"><Link to={"/Notice"} className={"main_nav"}>공지사항</Link></li>
                <li className="mainMenu right1"><Link to={"/Event"} className={"main_nav"}>이벤트</Link></li>
            </div>

            <div className="main_first">
                <div className="first_left">
                    <ScrollAnimation>
                    <img src={Mainlogo} className={"main_logo"} alt={"메인로고"}/>
                    </ScrollAnimation>
                    </div>
                <ScrollAnimation className={"font_font"}>
                <div ref={textRef} className={isVisible2 ? "first_right" : ""}>간단하게 스캔하여 저장하자!! <br />네컷앨범을 사용해 보세요</div>
                </ScrollAnimation>
            </div>
            <p className={"font_font"}>르세라핌과 사진 콜라보 이벤트!!</p>
            <div className={"third_div"}>
                <div>
                    <img className={"event_div"} src="/main_img/event.png" alt="" />
                </div>
            </div>
            <p className="font_font">요즘은 사진을 어떻게 찍을까?</p>
            <div className="main_div">
                {boardList.slice(0, 3).map((board) => (
                    <div className="third" key={board.id}>
                        <img className={isVisible1 ? "frame-in1" : "frame-out1"} src={`./images/${board.writerId}/${board.media.categoryName}/${board.media.mediaName}`} alt={"프레임1"} ref={imageRef1}/>
                    </div>
                ))}
            </div>
            <p className="font_font">내가 만든 포즈 한번봐줘!</p>
            <div className="main_div">
                {poseList.slice(0, 3).map((board) => (
                    <div className="third" key={board.id}>
                        <img className={isVisible1 ? "frame-in1" : "frame-out1"} src={`./images/${board.writerId}/${board.media.categoryName}/${board.media.mediaName}`} alt={"프레임1"} ref={imageRef1}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;