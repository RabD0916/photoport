import './nav.scss';
import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import Search from '../img/search.png';
import Mypag from '../img/mypage.png';
import { useLocation } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import LogoutIcon from '../img/logout.png';
function Nav() {
    const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');

    //검색창 보이기
    const[visible,setVisible] = useState(false);
    //검색창에 들어가는 입력값
    const [search, setSearch] = useState("");


    // 로그인 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 로그인 상태 확인
        const token = localStorage.getItem("accessToken");
        const storedUsername = localStorage.getItem("id");
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
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expirationTime");
        setIsLoggedIn(false);
        setUserId('');
        navigate("/");
    }
    const onChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    return (
        <>
            <nav className="main_navbar">
                <div className="centerLink">
                    <Link to={"/"} className={"center main_a"}>포토포트</Link>
                </div>
                <div className="rightLinks">
                    <div className="searchLink">
                        {visible && <input className={"search_bar"} type={"text"} name={search}/>}
                        <button className="right" onClick={() =>{
                            setVisible(!visible);
                        }}><img className={"search_icon"} src={Search} alt="하이"/></button>
                    </div>
                    <div className="otherLinks">
                        <Link to={"/gallery/" + userId} className={"downright main_b"}
                              onClick={isUserIdEmpty}>갤러리</Link>

                        <div className={"dropdown"}>
                            <span className="dropbtn downright main_b">게시판</span>
                            <div className={"dropdown-content"}>
                                <Link to={"/Board"} className={"drop_a"}>공유게시판</Link>
                                <Link to={"/Pose"} className={"drop_a"}>포즈게시판</Link>
                            </div>
                        </div>
                        {
                                isLoggedIn ? (
                                    <div className={"nav_div"}>
                                        <Link to={"/Mypage"} className={"drop_a"}>
                                            <img className={"mypage_icon"} src={Mypag} alt="마이페이지"/>
                                        </Link>
                                        <button className={"mypage_btn"} onClick={logoutHandler}>
                                            <img className={"mypage_icon"} src={LogoutIcon} alt="로그아웃"/>
                                        </button>
                                    </div>
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