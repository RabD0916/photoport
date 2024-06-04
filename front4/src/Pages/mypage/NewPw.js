import React, { useState } from 'react';
import axios from 'axios';
import "./css/login.scss"
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {useLocation} from "react-router-dom";


const Login = ({ handleLogin }) => { // 함수 컴포넌트 이름을 대문자로 변경
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;

    const navigate = useNavigate();
    const location = useLocation();
    const {id} = location.state;

    const [formData, setFormData] = useState({
        id,
        password: '',
        repassword: '',
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

        if (formData.password !== formData.repassword) {
            alert("입력하신 비밀번호가 서로 일치하지 않습니다. 다시 확인해주세요");
            return;
        }

        try {
            const response = await axios.post(`${SERVER_IP}/api/newPwUpdate`, formData);
            navigate("/")
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div>
            <div className="container">
                <ul className="links">
                    <li>
                        <a href="#" id="signin">비밀번호 재설정</a>
                    </li>
                </ul>

                <form onSubmit={handleSubmit} method="post">
                    <div className="first-input input__block first-input__block">
                        <input type="password" placeholder="새로운 비밀번호를 입력해주세요" className="input" name="password" value={formData.password} onChange={handleChange}   />
                    </div>
                    <div className="input__block">
                        <input type="password" placeholder="비밀번호를 다시 입력해주세요" className="input" name="repassword" value={formData.repassword} onChange={handleChange}    />
                    </div>
                    <button className="signin__btn">
                        Sign in
                    </button>
                </form>
            </div>

        </div>
    );
}

export default Login;
