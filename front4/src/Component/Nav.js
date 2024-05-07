import './css/nav.scss';
import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import Search from '../img/search.png';
import Mypag from '../img/mypage.png';
import { useLocation } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import LogoutIcon from '../img/logout.png';
import ListIcon from '../img/list.png';
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
    const [isWidth, setIsWidth] = useState(false);
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };


    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            if (windowWidth > 600) {
                setIsWidth(true);
                console.log(windowWidth);
            } else {
                setIsWidth(false);
            }
        };

        // 처음 한 번 호출하고, 창 크기가 변경될 때마다 다시 호출합니다.
        handleResize(); // 초기 호출
        window.addEventListener('resize', handleResize); // 리사이즈 이벤트 리스너 등록

        return () => {
            // 컴포넌트가 언마운트되기 전에 이벤트 리스너를 제거합니다.
            window.removeEventListener('resize', handleResize);
        };
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 이펙트를 실행합니다.


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
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("id");
        localStorage.removeItem("userNick");
        setIsLoggedIn(false);
        setUserId('');
        navigate("/");
    }
    const onChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    return (
        <>
            <nav className="main_navBar">
                <div className="centerLink">
                    <Link to={"/"} className={"main_a"}>포토포트</Link>
                </div>
                <div className="rightLinks">
                    <div className="searchLink">
                        {visible && <input className={"search_bar"} type={"text"} name={search}/>}
                        <button className="right" onClick={() =>{
                            setVisible(!visible);
                        }}><img className={"search_icon"} src={Search} alt="하이"/></button>
                    </div>
                    {
                        isWidth ? (
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
                        <Link to={"/FindFriend"} className={"downright main_b"} onClick={isUserIdEmpty}>친구추가</Link>
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
                            {/*<Link to={"/login"}><img className={"mypage_icon"} src={Mypag} alt="하이"/></Link>*/}
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
                                <div className="content">
                                    {/* Content */}
                                </div>
                            </div>
                        )
                    }
                </div>
                {/*<input type={"text"} placeholder={"유저 아이디"} value={userId} onChange={saveUserId}></input>*/}
            </nav>
        </>
);
}

export default Nav;