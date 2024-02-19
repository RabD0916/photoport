import React, {useEffect, useState} from 'react';
import './main.css';


const Main = (props) => {

    const [data, setData] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        fetch("/showMe")
            .then((res) => {
                return res.json();
            })
            .then(function (result) {
                setData(result);
            })
    },[]);

    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };

    useEffect(() => {
        window.addEventListener("scroll", updateScroll);
    }, []);

    return (
                <div>
                    <div>
                    <img className="center1" src="/a1.png" alt="센터1"/>
                    </div>
                    <div className="mainBar">
                        <li className="mainMenu">공지 사항</li>
                        <li className="mainMenu">이벤트</li>
                    </div>
                    <img className={scrollPosition > 20 ? "mount1" : "hidden"} src="/img.png" alt="강아지"/>
                </div>
    );
};

export default Main;
