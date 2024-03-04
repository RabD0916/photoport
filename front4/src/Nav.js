import './nav.css';
import {Link} from "react-router-dom";
import {useState} from "react";
function Nav() {
    const [userId, setUserId] = useState('');

    const saveUserId = e => {
        setUserId(e.target.value);
    };

    return(
        <>
            <nav className="navbar">
                <Link to={"/"} className={"navMenu left"}>공지 사항</Link>
                <Link to={"/user/" + userId} className={"navMenu left"}>갤러리</Link>
                <Link to={"/"} className={"navMenu"}>네컷 생성</Link>
                <Link to={"/"} className={"navMenu right"}>이름 로고</Link>
                <Link to={"/"} className={"navMenu right"}>검색 하기</Link>
            </nav>

            <input type={"text"} placeholder={"유저 아이디"} value={userId} onChange={saveUserId}></input>
        </>

    );
}

export default Nav;
