import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./css/login.scss";
import axios from "axios";

const SignUp = ({ onSignUpSuccess }) => {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        userNick: '',
        phone: '',
        birth: '',
        email: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 이메일 유효성 검사 함수
    const isValidEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    // 전화번호 유효성 검사 함수
    const isValidPhone = (phone) => {
        const phonePattern = /^\d{10,11}$/; // 10자리 또는 11자리 숫자만 유효
        return phonePattern.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 비어있는 항목 검사
        const isEmpty = Object.values(formData).some(x => x === '');
        if (isEmpty) {
            alert("모든 항목은 필수 입력입니다");
            return;
        }

        // 이메일 형식 검사
        if (!isValidEmail(formData.email)) {
            alert("유효하지 않은 이메일 형식입니다.");
            return;
        }

        // 전화번호 형식 검사
        if (!isValidPhone(formData.phone)) {
            alert("유효하지 않은 전화번호 형식입니다. (10~11자리 숫자)");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/join', formData);
            console.log(response.data);
            if (response.status === 200) {
                console.log("Success : ", response.status);
                navigate("/login");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1 className="sign_font">회원가입</h1>
            <div className="join_style">
                <form onSubmit={handleSubmit}>
                    <p className="sign_p">*아이디 </p>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        className="sign_input"
                        onChange={handleChange}
                    />
                    <br/>
                    <p className="sign_p">*비밀번호 </p>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        className="sign_input"
                        onChange={handleChange}
                    />
                    <br/>
                    <p className="sign_p">*닉네임 </p>
                    <input
                        type="text"
                        name="userNick"
                        value={formData.userNick}
                        className="sign_input"
                        onChange={handleChange}
                    />
                    <br/>
                    <p className="sign_p">*전화번호 </p>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        className="sign_input"
                        onChange={handleChange}
                    />
                    <br/>
                    <p className="sign_p">*생년월일 </p>
                    <input
                        type="date"
                        name="birth"
                        value={formData.birth}
                        className="sign_input"
                        onChange={handleChange}
                    />
                    <br/>
                    <p className="sign_p">*이메일 </p>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="sign_input"
                        onChange={handleChange}
                    />
                <br/>
                <button type="submit" className="next_input">가입하기</button>
            </form>
            </div>
        </div>
    );
};

export default SignUp
