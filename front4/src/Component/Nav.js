import './css/nav.scss';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Search from '../img/search.png';
import Mypag from '../img/mypage.png';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoutIcon from '../img/logout.png';
import ListIcon from '../img/list.png';
import axios from "axios";

function Nav() {
    const storedUsername = localStorage.getItem("id");
    const location = useLocation();
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [visible, setVisible] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isWidth, setIsWidth] = useState(false);
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // New state to track admin status

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            if (windowWidth > 600) {
                setIsWidth(true);
            } else {
                setIsWidth(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const storedUsername = localStorage.getItem("id");
        if (token) {
            setIsLoggedIn(true);
            if (storedUsername) {
                setUserId(storedUsername);
            }
        }
    });

    const isUserIdEmpty = (e) => {
        if (userId.length < 1) {
            alert("로그인 후에 이용 가능합니다!");
            navigate("/login");
            e.preventDefault();
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("id");
        localStorage.removeItem("userNick");
        setIsLoggedIn(false);
        setUserId('');
        navigate("/");
    };

    const searchContent = () => {
        const encodedKeyword = encodeURIComponent(keyword);
        navigate(`/search?keyword=${encodedKeyword}`);
    };

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchContent();
        }
    };

    return (
        <>
            <nav className="main_navBar">
                <div className="centerLink">
                    <Link to={"/"} className={"main_a"}>포토포트</Link>
                </div>
                <div className="rightLinks">
                    <div className="searchLink">
                        {visible &&
                            <div>
                                <input
                                    type="text"
                                    className="search_bar"
                                    value={keyword}
                                    onChange={handleInputChange}
                                    // onKeyPress={handleKeyPress}
                                    placeholder="검색어를 입력하세요"
                                />
                                <button onClick={searchContent}>전송</button>
                            </div>
                        }
                        <button className="right" onClick={() => {
                            setVisible(!visible);
                        }}><img className={"search_icon"} src={Search} alt="하이"/></button>
                    </div>
                    {
                        isWidth ? (
                            <div className="otherLinks">
                                <Link to={"/gallery/" + userId} className={"downright main_b"} onClick={isUserIdEmpty}>갤러리</Link>
                                <div className={"dropdown"}>
                                    <span className="dropbtn downright main_b" onClick={isUserIdEmpty}>게시판</span>
                                    <div className={"dropdown-content"} onClick={isUserIdEmpty}>
                                        <Link to={"/Board"} className={"drop_a"}>공유게시판</Link>
                                        <Link to={"/Pose"} className={"drop_a"}>포즈게시판</Link>
                                        <Link to={"/Notice"} className={"drop_a"}>공지게시판</Link>
                                    </div>
                                </div>
                                <Link to={"/FindFriend"} className={"downright main_b"} onClick={isUserIdEmpty}>친구추가</Link>
                                {
                                    isAdmin && <Link to={"/Blacklist"} className={"downright main_b"}>블랙리스트 관리</Link>
                                }
                                {
                                    isLoggedIn ? (
                                        <div className={"nav_div"}>
                                            <Link to={"/Mypage"}>
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
                            </div>
                        ) : (
                            <div>
                                <div className={`sidebar ${isSidebarVisible ? 'active' : ''}`}>
                                    <button className="toggle_button" onClick={toggleSidebar}>
                                        <img className={"list_icon"} src={ListIcon} alt="#" />
                                    </button>
                                    {
                                        isLoggedIn ? (
                                            <div className={"nav_div"}>
                                                <Link to={"/gallery/" + userId} className={"downright"} onClick={isUserIdEmpty}>갤러리</Link>
                                                <div className={"dropdown"}>
                                                    <span className="dropbtn downright" onClick={isUserIdEmpty}>게시판</span>
                                                    <div className={"dropdown-content"} onClick={isUserIdEmpty}>
                                                        <Link to={"/Board"} className={"drop_a"}>공유게시판</Link>
                                                        <Link to={"/Pose"} className={"drop_a"}>포즈게시판</Link>
                                                        <Link to={"/Notice"} className={"drop_a"}>공지게시판</Link>
                                                    </div>
                                                </div>
                                                <Link to={"/FindFriend"} className={"downright"} onClick={isUserIdEmpty}>친구추가</Link>
                                                {
                                                    isAdmin && <Link to={"/Blacklist"} className={"downright"}>블랙리스트 관리</Link>
                                                }
                                                <Link to={"/Mypage"}>
                                                    <div className={"in_text"}>마이페이지</div>
                                                </Link>
                                                <button className={"in_button"} onClick={logoutHandler}>
                                                    <div>로그아웃</div>
                                                </button>
                                            </div>
                                        ) : (
                                            <Link to={"/login"}>
                                                <div className={"in_text"}>로그인</div>
                                            </Link>
                                        )
                                    }
                                </div>
                                <div className="content">
                                    {/* Content */}
                                </div>
                            </div>
                        )
                    }
                </div>
            </nav>
        </>
    );
}

export default Nav;
