import React, { useState } from 'react';
import axios from 'axios';
import "./css/login.css"
import "../Css/nav.css"
import Kakao from "../img/kakao.png";

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
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"/>
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>

            <h4 className="log_mark">
                로그인
            </h4>
            <div className="login">
            <form onSubmit={handleSubmit} className="form1 g-3">
                <label>
                    <input type="text" className="form-control"name="username" value={formData.username} onChange={handleChange}  placeholder="아이디를 입력해 주세요" />
                </label>
                <br />
                <label>
                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange}  placeholder="비밀번호를 입력해 주세요" />
                </label>
                <br />
                <div className="col-auto">
                    <button type="button" className="btn btn-success fbtn">Success</button>
                </div>
            </form>
                <div className="oauth2_logo">
                    <img src={Kakao} className="oauth1" alt="카카오" />
                    <img src={Kakao} className="oauth2" alt="카카오" />
                    <img src={Kakao} className="oauth3" alt="카카오" />
                </div>
                <div className="under_b">
                        <Link to={"/signup"} className={"sign"}>SIUP</Link>
                        <div className='v-line'></div>
                        <Link to={"/findID"} className={"idFind"}>FIND ID</Link>
                        <div className='v-line'></div>
                        <Link to={"/findPW"} className={"pwFind"}>FIND PW</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
