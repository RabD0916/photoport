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
                <li className="mainMenu left1"><Link to={"/Notice"} className={"mainnav"}>공지사항</Link></li>
                <li className="mainMenu right1"><Link to={"/Event"} className={"mainnav"}>이벤트</Link></li>
            </div>

            <div className="mainfirst">
                <div className="firstleft">
                    <img src={Mainlogo} className={"mainlogo"} alt={"메인로고"}/>
                </div>
                <div className="firstright">간편하게 스캔하여 저장하자!! 네컷앨범을 사용해 보세요</div>
            </div>
            <div className="fontfont">요즘은 사진을 어떻게 찍을까?</div>
            <div className="mainsecond">
                <div className="second">
                    <div className="second1" style={{display: slideIndex === 0 ? 'block' : 'none'}}>
                        <img className="seimg" src="/one.jpg" alt="짱구 독사진 포즈"/>
                    </div>
                    <div className="second1" style={{display: slideIndex === 1 ? 'block' : 'none'}}>
                        <img className="seimg" src="/one1.jpg" alt="수지 독사진 포즈"/>
                    </div>
                    <div className="second2">포즈2</div>
                    <div className="second3">포즈3</div>
                </div>
            </div>
            <div className="fontfont">원하는 프레임을 골라 자신만의 네컷을 만들자!</div>
            <div className="mainthird">
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