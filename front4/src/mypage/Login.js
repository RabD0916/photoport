import React, { useState } from 'react';
import axios from 'axios';
import "./css/login.scss"
import {Link} from "react-router-dom";

const Login = ({ handleLogin }) => { // 함수 컴포넌트 이름을 대문자로 변경

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/signin', formData);
            const accessToken = response.data.accessToken;
            console.log("accessToken 값 : " + accessToken);

            localStorage.setItem('accessToken', accessToken);
            // 로그인 성공 시 handleLogin 함수 호출
            handleLogin(accessToken);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div>
            <div className="container">
                <ul className="links">
                    <li>
                        <a href="#" id="signin">로그인</a>
                    </li>
                </ul>

                <form onSubmit={handleSubmit} method="post">
                    <div className="first-input input__block first-input__block">
                        <input type="email" placeholder="아이디를 입력해주세요" className="input" name="username" value={formData.username} onChange={handleChange}   />
                    </div>
                    <div className="input__block">
                        <input type="password" placeholder="비밀번호를 입력해주세요" className="input" name="password" value={formData.password} onChange={handleChange}    />
                    </div>
                    <button className="signin__btn">
                        Sign in
                    </button>
                </form>

                <div className="separator">
                    <p>OR</p>
                </div>

                <button className="google__btn">
                    <i className="fa fa-google"></i>
                    <a href="src={Kakao">카카오</a>
                </button>

                <button className="github__btn">
                    <i className="fa fa-github"></i>
                    <a href="src={Kakao">카카오</a>
                </button>
                
                <button className="github__btn">
                    <i className="fa fa-github"></i>
                    <a href="src={Kakao">카카오</a>
                </button>
                <p className={"id_role"}>
                    <Link to={"/join"}>SIGN UP</Link>
                    <Link to={"/findID"}>FIND ID</Link>
                    <Link to={"/findPW"}>FIND PW</Link>
                </p>
            </div>

            </div>
    );
}

export default Login;
