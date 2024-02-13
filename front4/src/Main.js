import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

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
        <header className="App-header">
            <ul>
                <div>
                    <img className={scrollPosition > 20 ? "mount1" : "hidden"} src="/img.png" alt="강아지"/>
                </div>
                {data.map((v, idx) => <li key={`${idx}-${v}`}>{v}</li>)}
            </ul>
        </header>
    );
};

export default Main;
