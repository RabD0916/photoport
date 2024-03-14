import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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
            <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossOrigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossOrigin="anonymous"></script>
            <h2>
                로그인
            </h2>
            <form onSubmit={handleSubmit} class="row g-3">
                <label>
                    <input type="text" className="form-control"name="username" value={formData.username} onChange={handleChange}  placeholder="아이디를 입력해 주세요" />
                </label>
                <br />
                <label>
                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange}  placeholder="비밀번호를 입력해 주세요" />
                </label>
                <br />
                <div className="col-auto">
                <button type="submit" className="btn btn-primary mb-3">로그인</button>
                </div>
            </form>
        </div>
    );
}

export default Login;
