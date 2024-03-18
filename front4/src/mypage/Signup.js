import React, { useState } from 'react';
import "./css/login.css";
const Signup=() =>{
    const [selectedOption, setSelectedOption] = useState('naver.com'); // 기본값으로 naver.com을 설정
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };
    return(
        <div>
            <h1>회원가입</h1>
            <div className="join_style">
            <form action="" method="post">
                <p className="sign_p">*아이디  </p><input type="text" className="sign_input" placeholder="아이디를 입력하세요."/>
                <p className="sign_p">*비밀번호  </p><input type="password" className="sign_input" placeholder="비밀번호를 입력하세요."/>
                <p className="sign_p">*비밀번호 확인  </p><input type="password" className="sign_input" placeholder="비밀번호 확인."/>
                <p className="sign_p">*이메일  </p>
                <p className="email_style">
                <input type="text" className="sign_input" placeholder="이메일 입력"/>
            </p>
                <p className="sign_p">전화번호  </p><input type="text" className="sign_input"/>
            </form>
            <input className="next_input" type="submit" value="회원가입"/>
            </div>
        </div>
    )
}
export default Signup;