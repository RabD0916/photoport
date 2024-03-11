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
                <div className="centerLink">
                    <Link to={"/"} className={"center"}>포토포트</Link>
                </div>
                <div className="rightLinks">
                    <div className="searchLink">
                        <Link to={"/"} className={"right"}>검색 하기</Link>
                    </div>
                    <div className="otherLinks">
                        <Link to={"/user/" + userId} className={"downright"}>갤러리</Link>
                        <Link to={"/"} className={"downright"}>네컷 생성</Link>
                        <Link to={"/"} className={"downright"}>마이페이지</Link>
                        <Link to={"/"} className={"downright"}>게시판</Link>
                    </div>
                </div>
            </nav>

            <input type={"text"} placeholder={"유저 아이디"} value={userId} onChange={saveUserId}></input>
        </>

    );
}

export default Nav;
