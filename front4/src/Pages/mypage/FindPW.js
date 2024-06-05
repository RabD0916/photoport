import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import {useNavigate} from "react-router-dom";
const FindPW=({ handleLogin }) =>{
    const [email, setEmail] = useState('');
    const [authNum, setAuthNum] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    const navigate = useNavigate();
    const [id, setId] = useState('') // 사용자 아이디 상태

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleAuthCodeChange = (e) => {
        setAuthNum(e.target.value);
    };

    const handleCheckUserId = async () => {
        try {
            // 사용자 아이디 존재 여부 확인 요청
            const response = await axios.post('http://localhost:8080/api/checkUserId', {
                id
            });
            const res = response;

            if (res) {
                alert("아이디 확인 완료!");
                setInputVisible(true);
            } else {
                alert('존재하지 않는 아이디입니다.');
            }
        } catch (error) {
            console.error('아이디 확인 실패:', error);
            alert('아이디 확인에 실패하였습니다.');
        }
    };

    const handleSendAuthCode = async () => {
        try {
            // 이메일 인증번호 발송 요청
            const response = await axios.post('http://localhost:8080/api/mailSend',
                {email}
            );
            const res = response.data;

            if (res) {
                setInputVisible(true); // 인증번호 입력 필드를 보이게 설정
            } else {
                console.error('인증번호 발송 실패!');
            }
        } catch (error) {
            console.error('인증번호 발송 실패:', error);
            alert('인증번호 발송에 실패하였습니다.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 인증번호 확인 요청
            const response = await axios.post('http://localhost:8080/api/newPw', { // URL 경로를 소문자로 시작하는 것으로 수정
                email,
                authNum
            });
            const result = response.data; // 구조 분해 할당을 사용하여 result와 message 추출

            alert("비밀번호 재생성 페이지로 이동");
            navigate('/newPw', {state: {id}}); // id와 값을 함께 넘김
        } catch (error) {
            console.error('인증 실패:', error);
            alert('인증번호가 올바르지 않습니다.');
        }
    };

    return (
        <div>
            <h4>비밀번호 찾기</h4>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="input__block">
                        <input type="text" placeholder="아이디를 입력해주세요" className="input1" name="id"
                               onChange={(e) => setId(e.target.value)}/> {/* 이 부분을 수정했습니다. */}
                        <button type="button" className="input_btn" onClick={handleCheckUserId}>아이디 확인</button>
                    </div>
                    {inputVisible && (
                        <>
                            <div className="input__block">
                                <input type="email" placeholder="이메일을 입력해주세요" className="input1" name="email"
                                       onChange={handleEmailChange}/>
                                <button type="button" className="input_btn" onClick={handleSendAuthCode}>인증번호 발송
                                </button>
                            <input type="text" placeholder="6자리 입력" onChange={handleAuthCodeChange}/>
                            </div>
                            <p className="find__p">*인증번호를 입력해 주세요</p>
                        </>
                    )}
                    <button className="signin__btn" type="submit">확인</button>
                </form>
            </div>
        </div>
    );
};
export default FindPW;