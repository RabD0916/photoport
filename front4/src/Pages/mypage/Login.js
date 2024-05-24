import React, { useState } from 'react';
import axios from 'axios';
import "./css/login.scss"
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Login = ({ handleLogin }) => { // 함수 컴포넌트 이름을 대문자로 변경

    const handleKakaoLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=ab365f86f03b47b75738f7a3f6bd64ab&redirect_uri=http://localhost:3000/oauth/kakao&response_type=code`;
    };

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
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
            console.log(formData);
            const response = await axios.post('http://localhost:8080/api/signin', formData);
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;


            console.log("accessToken 값 : " + accessToken);
            console.log("refreshToken 값 : " + refreshToken);

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('id', formData.id);
            localStorage.setItem('userNick', response.data.userNick);
            navigate("/")
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className="legend_box">
            <div className="container">
                <ul className="links">
                    <li>
                        <a href="#" id="signin">로그인</a>
                    </li>
                </ul>

                <form onSubmit={handleSubmit} method="post">
                    <div className="first-input input__block first-input__block">
                        <input type="text" placeholder="아이디를 입력해주세요" className="input" name="id" value={formData.id}
                               onChange={handleChange}/>
                    </div>
                    <div className="input__block">
                        <input type="password" placeholder="비밀번호를 입력해주세요" className="input" name="password"
                               value={formData.password} onChange={handleChange}/>
                    </div>
                    <button className="signin__btn">
                        로그인
                    </button>
                </form>

                <div className="separator">
                    <p>OR</p>
                </div>

                    <img className="signin__btn" src="/kakao_login.png" alt="카카오 로그인" onClick={handleKakaoLogin} style={{ cursor: 'pointer' }}/>

                {/*<button className="github__btn">*/}
                {/*    <i className="fa fa-github"></i>*/}
                {/*    <Link to={"/kakaoLogin"}>카카오</Link>*/}
                {/*</button>*/}

                {/*<button className="github__btn">*/}
                {/*    <i className="fa fa-github"></i>*/}
                {/*    <a href="src={Kakao">카카오</a>*/}
                {/*</button>*/}

                {/*<button className="github__btn">*/}
                {/*    <i className="fa fa-github"></i>*/}
                {/*    <a href="src={Kakao">카카오</a>*/}
                {/*</button>*/}
                <br/>
                <br/>
                <p className={"id_role"}>
                    <Link to={"/join"}>가입하기</Link>
                    <Link to={"/findID"}>아이디 찾기</Link>
                    <Link to={"/findPW"}>비밀번호 찾기</Link>
                </p>
            </div>

        </div>
    );
}

export default Login;
