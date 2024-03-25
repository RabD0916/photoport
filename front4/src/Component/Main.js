import React, { useEffect, useState } from 'react';
import '../Css/main.css';
import Mainlogo from '../testttt/photoport.png';
import {Link} from "react-router-dom";
import Frame1 from "../testttt/frame1.jpg"
import Frame2 from "../testttt/frame2.jpg"
import Frame3 from "../testttt/frame3.jpg"

const Main = (props) => {
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prevIndex) => (prevIndex + 1) % 2); // 여기서 3은 이미지의 개수에 맞게 수정해주세요
        }, 5000);

        return () => clearInterval(interval);
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
                    <img src={Mainlogo} className={"main_logo"} alt={"메인로고"}/>
                </div>
                <div className="first_right">간편하게 스캔하여 저장하자!! <br />네컷앨범을 사용해 보세요</div>
            </div>

            <p className="font_font">요즘은 사진을 어떻게 찍을까?</p>

            <div className="main_div">
                <div className="third">
                    <img className={"frame"} src={"/one.jpg"} alt={"프레임1"}/>
                    <img className={"frame"} src={"/one1.jpg"} alt={"프레임2"}/>
                    <img className={"frame"} src={"/one1.jpg"} alt={"프레임3"}/>
                </div>
            </div>
            <p className="font_font">내가 만든 포즈 한번봐줘!</p>
            <div className="main_div">
                <div className="third">
                    <img className={"frame"} src={Frame1} alt={"프레임1"}/>
                    <img className={"frame"} src={Frame2} alt={"프레임2"}/>
                    <img className={"frame"} src={Frame3} alt={"프레임3"}/>
                </div>
            </div>
        </div>
    );
};

export default Main;