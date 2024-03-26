import '../Css/nav.scss';
import { Link } from "react-router-dom";
import { useState } from "react";
import Search from '../testttt/search.png';
import Mypag from '../testttt/mypage.png';
function Nav() {
    const [userId, setUserId] = useState('');

    const saveUserId = e => {
        setUserId(e.target.value);
    };

    const isUserIdEmpty = e => {
        if(userId.length < 1) {
            alert("로그인 필요");
            e.preventDefault();
        }
    }
    return (
        <>
            <nav className="main_navbar">
                <div className="centerLink">
                    <Link to={"/"} className={"center main_a"}>포토포트</Link>
                </div>
                <div className="rightLinks">
                    <div className="searchLink">
                        <Link to={"/"} className="right"><img className={"searchicon"} src={Search} alt="하이"/></Link>
                    </div>
                    <div className="otherLinks">
                        <Link to={"/gallery/" + userId} className={"downright main_b"} onClick={isUserIdEmpty}>갤러리</Link>
                        <Link to={"/Board"} className={"downright main_b"}>게시판</Link>
                        <Link to={"/login"}><img className={"mypageicon"} src={Mypag} alt="하이"/></Link>
                    </div>
                </div>
            <input type={"text"} placeholder={"유저 아이디"} value={userId} onChange={saveUserId}></input>
            </nav>

        </>
    );
}

export default Nav;