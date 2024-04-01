import '../Css/nav.scss';
import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import Search from '../testttt/search.png';
import Mypag from '../testttt/mypage.png';
import { useLocation } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import LogoutIcon from '../testttt/logout.png';
function Nav() {
    const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');

    // 로그인 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 로그인 상태 확인
        const token = localStorage.getItem("accessToken");
        const storedUsername = localStorage.getItem("username");
        if (token) {
            setIsLoggedIn(true);
            if (storedUsername) {
                setUserId(storedUsername);
            }
        }
    });

    // const saveUserId = e => {
    //     setUserId(e.target.value);
    // };

    const isUserIdEmpty = e => {
        if(userId.length < 1) {
            alert("로그인 필요");
            e.preventDefault();
        }
    }

    // 로그아웃 핸들러
    const logoutHandler = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        setUserId('');
        navigate("/");
    }

    return (
        <>
            <nav className="main_navbar">
                <div className="centerLink">
                    <Link to={"/"} className={"center main_a"}>포토포트</Link>
                </div>
                <div className="rightLinks">
                    <div className="searchLink">
                        <Link to={"/"} className="right"><img className={"search_icon"} src={Search} alt="하이"/></Link>
                    </div>
                    <div className="otherLinks">
                        <Link to={"/gallery/" + userId} className={"downright main_b"} onClick={isUserIdEmpty}>갤러리</Link>
                        <Link to={"/Board"} className={"downright main_b"}>게시판</Link>
                        {
                            isLoggedIn ? (
                                <button onClick={logoutHandler}>
                                    <img className={"mypage_icon"} src={LogoutIcon} alt="로그아웃"/>
                                </button>
                            ) : (
                                <Link to={"/login"}><img className={"mypage_icon"} src={Mypag} alt="로그인"/></Link>
                            )
                        }
                        {/*<Link to={"/login"}><img className={"mypage_icon"} src={Mypag} alt="하이"/></Link>*/}
                    </div>
                </div>
            {/*<input type={"text"} placeholder={"유저 아이디"} value={userId} onChange={saveUserId}></input>*/}
            </nav>

        </>
    );
}

export default Nav;