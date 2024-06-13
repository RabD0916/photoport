import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const FindID = ({ handleLogin }) => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [email, setEmail] = useState('');
    const [authNum, setAuthNum] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    const navigate = useNavigate();
    const [timerRunning, setTimerRunning] = useState(false);
    const [count, setCount] = useState(300);

    useEffect(() => {
        let id;

        if (timerRunning) {
            id = setInterval(() => {
                setCount((prevCount) => prevCount - 1);
            }, 1000);
        }

        return () => clearInterval(id);
    }, [timerRunning]);

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
            const response = await axios.post(`${SERVER_IP}/api/mailSend`, { email });
            const res = response.data;

            if (res) {
                setInputVisible(true);
                setTimerRunning(true);
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
            const response = await axios.post(`${SERVER_IP}/api/mailauthCheck`, {
                email,
                authNum
            });
            const { username, message } = response.data;
            console.log("사용자 아이디:", username);
            console.log("메시지:", message);

            alert(`사용자 아이디는 ${username} 입니다. ${message}`);
            navigate('/login');
        } catch (error) {
            console.error('인증 실패:', error);
            alert('인증번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-main-image">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md border border-gray-300">
                <h4 className="text-2xl font-bold text-center mb-4">아이디 찾기</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="email"
                            placeholder="이메일을 입력해주세요"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                            name="email"
                            onChange={handleEmailChange}
                        />
                        <button onClick={handleSendAuthCode}
                                className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black">
                                인증번호 발송
                            </span>
                        </button>
                        {inputVisible && (
                            <>
                                <input
                                    type="text"
                                    placeholder="6자리 입력"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 mt-2"
                                    onChange={handleAuthCodeChange}
                                />
                                <p className="text-gray-600 text-sm mt-2">*인증번호를 입력해 주세요</p>
                                <p className="text-red-500 text-sm">{minutes}분 {seconds}초</p>
                            </>
                        )}
                    </div>
                    <button type="submit"
                            className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                        <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black">
                            확인
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FindID;
