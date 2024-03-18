import React, { useState } from 'react';
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
                <p className="sign_p">아이디 : </p><input type="text" className="sign_input"/>
                <p className="sign_p">비밀번호 : </p><input type="password" className="sign_input"/>
                <p className="sign_p">비밀번호 확인 : </p><input type="password" className="sign_input"/>
                <p className="sign_p">이메일 : </p><p className="sign_input"><input type="text" className="call_input"/> @ <input type="text" className="call_input" placeholder=""/>
                <select id="" >
                    <option value="">이메일도메인</option>
                    <option value="naver.com">naver.com</option>
                    <option value="google.com">google.com</option>
                    <option value="hanmail.com">hanmail.com</option>
                    <option value="daum.com">daum.com</option>
                </select>
            </p>
                <p className="sign_p">전화번호 : </p><input type="text" className="sign_input"/>
            </form>
            <input type="submit" value="회원가입"/>
            </div>
        </div>
    )
}
export default Signup;