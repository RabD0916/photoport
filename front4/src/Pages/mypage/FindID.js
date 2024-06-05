import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const FindID = ({ handleLogin }) => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [email, setEmail] = useState('');
    const [authNum, setAuthNum] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    const navigate = useNavigate();
    const [timerRunning, setTimerRunning] = useState(false);
    // 시간을 담을 변수
    const [count, setCount] = useState(300);

    useEffect(() => {
        // 설정된 시간 간격마다 setInterval 콜백이 실행된다.
        let id;

        if (timerRunning) {
            id = setInterval(() => {
                setCount((prevCount) => prevCount - 1);
            }, 1000);
        }

        return () => clearInterval(id);
    }, []);

    const minutes = Math.floor(count / 60);
    const seconds = count % 60;

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleAuthCodeChange = (e) => {
        setAuthNum(e.target.value);
    };

    const handleSendAuthCode = async () => {
        try {
            // 이메일 인증번호 발송 요청
            const response = await axios.post(`${SERVER_IP}/api/mailSend`,
                {email}
            );
            const res = response.data;

            if (res) {
                setInputVisible(true); // 인증번호 입력 필드를 보이게 설정
                setTimerRunning(true);//런닝
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
            const response = await axios.post(`${SERVER_IP}/api/mailauthCheck`, { // URL 경로를 소문자로 시작하는 것으로 수정
                email,
                authNum
            });
            const {username, message} = response.data; // 구조 분해 할당을 사용하여 result와 message 추출
            console.log("사용자 아이디:", username);
            console.log("메시지:", message); // 서버로부터 받은 메시지도 출력

            // 인증 성공 후 로직 처리 (예: 로그인 처리)
            // handleLogin(accessToken); // 실제 구현에 맞게 조정 필요

            alert(`사용자 아이디는 ${username} 입니다. ${message}`);
            navigate('/login');
        } catch (error) {
            console.error('인증 실패:', error);
            alert('인증번호가 올바르지 않습니다.');
        }
    };

    return (
        <div>
            <h4>아이디 찾기</h4>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="first-input input__block">
                        <input type="email" placeholder="이메일을 입력해주세요" className="input1" name="email" onChange={handleEmailChange} />
                        <button type="button" className={"input_btn"} onClick={handleSendAuthCode}>인증번호 발송</button>
                        {inputVisible && <input type="text" placeholder="6자리 입력" onChange={handleAuthCodeChange} />}
                        {inputVisible && <p className="find__p">*인증번호를 입력해 주세요</p>}
                        {inputVisible &&<p className={"time_font"}>{minutes}분 {seconds}초</p>}
                    </div>
                    <button className="signin__btn" type="submit">확인</button>
                </form>
            </div>
        </div>
    );
};

export default FindID;