import React from 'react';
import axios from 'axios';
import "./css/find.scss"
import { useState } from 'react';
const FindID=({ handleLogin }) =>{
    const [inputVisible, setInputVisible] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

    };
    const handelButton = (e) =>{
        setInputVisible(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/signin');
            const accessToken = response.data.accessToken;
            console.log("accessToken 값 : " + accessToken);

            localStorage.setItem('accessToken', accessToken);
            // 로그인 성공 시 handleLogin 함수 호출
            handleLogin(accessToken);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return(
        <div>
            <h4>아이디 찾기</h4>
                <div className="container">
                    <ul className="links">
                        <li>
                            <a href="#" id="signin">Find ID</a>
                        </li>
                    </ul>

                    <form onSubmit={handleSubmit} method="post">
                        <div className="first-input input__block">
                            <input type="email" placeholder="이메일을 입력해주세요" className="input1" name="username"  onChange={handleChange}  />
                            <input type="button" className={"input_btn"} value={"버튼"} onClick={handelButton} />
                            {inputVisible &&<input type={"text"} placeholder={"6자리 입력"}/>}
                            {inputVisible &&<p className={"find__p"}>*인증번호를 입력해 주세요</p>}
                        </div>
                        <button className="signin__btn">
                            Sign in
                        </button>
                    </form>
                </div>
        </div>
    )
}
export default FindID;