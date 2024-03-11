import React, { useEffect, useState } from 'react';
import './main.css';

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
                <img className="center1" src="/backbaxk.jpg" alt="센터1" />
            </div>
            <div className="mainBar">
                <li className="mainMenu left1">공지 사항</li>
                <li className="mainMenu right1">이벤트</li>
            </div>
            <div className="mainfirst">
                <div className="firstleft">
                    이벤트
                </div>
                <div className="firstright">간편하게 스캔하여 저장하자!! 네컷앨범을 사용해 보세요</div>
            </div>
            <div className="mainsecond">
                <div className="second">
                    <div className="second1" style={{ display: slideIndex === 0 ? 'block' : 'none' }}>
                        <img className="seimg" src="/one.jpg" alt="짱구 독사진 포즈" />
                    </div>
                    <div className="second1" style={{ display: slideIndex === 1 ? 'block' : 'none' }}>
                        <img className="seimg" src="/one1.jpg" alt="수지 독사진 포즈" />
                    </div>
                    <div className="second2">포즈2</div>
                    <div className="second3">포즈3</div>
                </div>
            </div>
            <div className="mainthird">
                <div className="third">
                    사진관
                </div>
            </div>
        </div>
    );
};

export default Main;