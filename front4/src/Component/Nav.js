import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Search from '../img/search.png';

function Nav() {
    const storedUsername = localStorage.getItem("id");
    const navigate = useNavigate();
    const [userId, setUserId] = useState(storedUsername || '');
    const [visible, setVisible] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(!!storedUsername);
    const [isAdmin, setIsAdmin] = useState(false); // New state to track admin status

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token && storedUsername) {
            setIsLoggedIn(true);
            setUserId(storedUsername);

            // You can add more logic here to verify the token with your backend
            // and set the admin status
            // For example:
            // axios.get(`${SERVER_IP}/api/verifyToken`, { headers: { Authorization: `Bearer ${token}` } })
            //     .then(response => {
            //         if (response.data.isAdmin) {
            //             setIsAdmin(true);
            //         }
            //     }).catch(error => {
            //         console.error("Token verification failed", error);
            //     });
        } else {
            setIsLoggedIn(false);
            setUserId('');
        }
    }, [storedUsername]);

    const isUserIdEmpty = (e) => {
        if (!userId) {
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

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <>
            <nav className="flex items-center justify-between flex-wrap bg-white py-4 lg:px-12 shadow border-solid border-t-2 border-blue-700">
                <div className="flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-solid border-b-2 border-gray-300 pb-5 lg:pb-0">
                    <div className="flex items-center flex-shrink-0 text-gray-800 mr-16">
                        <Link to={"/"} className="font-semibold text-xl tracking-tight">포토포트</Link>
                    </div>
                    <div className="block lg:hidden">
                        <button className="flex items-center px-3 py-2 border-2 rounded text-blue-700 border-blue-700 hover:text-blue-700 hover:border-blue-700">
                            <title>머지이건?</title>
                        </button>
                    </div>
                </div>
                <div className="menu w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8">
                    <div className="text-md font-bold text-blue-700 lg:flex-grow">
                        <Link to={"/gallery/" + userId}
                              className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                              onClick={isUserIdEmpty}>갤러리</Link>
                        <div className="relative inline-block text-left" onClick={toggleVisibility}>
                            <div
                                className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2 cursor-pointer"
                                style={{ padding: '12px 16px' }}>
                                게시판
                            </div>
                            {visible && (
                                <div
                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1" onClick={isUserIdEmpty}>
                                        <Link to="/Board"
                                              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">공유게시판</Link>
                                        <Link to="/Pose"
                                              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">포즈게시판</Link>
                                        <Link to="/Notice"
                                              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">공지게시판</Link>
                                        <Link to="/EventList"
                                              className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100">이벤트게시판</Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to={"/FindFriend"}
                              className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                              onClick={isUserIdEmpty}>친구추가</Link>
                        {isAdmin &&
                            <Link to={"/Blacklist"}
                                  className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
                                블랙리스트 관리</Link>
                        }
                    </div>
                </div>
                <div className="relative mx-auto text-gray-600 lg:block hidden">
                    <input
                        type="text"
                        className="border-2 border-gray-300 bg-white h-10 pl-2 pr-8 rounded-lg text-sm focus:outline-none"
                        value={keyword}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="검색어를 입력하세요"
                    />
                    <button className="absolute right-0 top-0 mt-3 mr-2" onClick={searchContent}>
                        <img className="text-gray-600 h-4 w-4 fill-current" src={Search} alt="검색사진"/>
                    </button>
                </div>
                <div className="flex">
                    {isLoggedIn ? (
                        <>
                            <Link to={"/Mypage"}
                                  className="block text-md px-4 py-2 rounded text-blue-700 ml-2 font-bold hover:text-white mt-4 hover:bg-blue-700 lg:mt-0">
                                MyPage
                            </Link>
                            <button
                                className="block text-md px-4  ml-2 py-2 rounded text-blue-700 font-bold hover:text-white mt-4 hover:bg-blue-700 lg:mt-0"
                                onClick={logoutHandler}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to={"/login"}
                              className="block text-md px-4  ml-2 py-2 rounded text-blue-700 font-bold hover:text-white mt-4 hover:bg-blue-700 lg:mt-0">
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Nav;
