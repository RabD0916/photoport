import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const FindPW = ({ handleLogin }) => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [email, setEmail] = useState('');
    const [authNum, setAuthNum] = useState('');
    const [inputVisible, setInputVisible] = useState(false);
    const navigate = useNavigate();
    const [id, setId] = useState(''); // 사용자 아이디 상태

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleAuthCodeChange = (e) => {
        setAuthNum(e.target.value);
    };

    const handleCheckUserId = async () => {
        try {
            // 사용자 아이디 존재 여부 확인 요청
            const response = await axios.post(`${SERVER_IP}/api/checkUserId`, {
                id
            });
            const res = response.data;

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
            const response = await axios.post(`${SERVER_IP}/api/mailSend`, { email });
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
            const response = await axios.post(`${SERVER_IP}/api/newPw`, {
                email,
                authNum
            });
            const result = response.data;

            alert("비밀번호 재생성 페이지로 이동");
            navigate('/newPw', { state: { id } });
        } catch (error) {
            console.error('인증 실패:', error);
            alert('인증번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-main-image">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md border border-gray-300">
                <h4 className="text-2xl font-bold text-center mb-4">비밀번호 찾기</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="아이디를 입력해주세요"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                            name="id"
                            onChange={(e) => setId(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={handleCheckUserId}
                            className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        >
                            <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black">
                                아이디 확인
                            </span>
                        </button>
                    </div>
                    {inputVisible && (
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="이메일을 입력해주세요"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                                name="email"
                                onChange={handleEmailChange}
                            />
                            <button
                                type="button"
                                onClick={handleSendAuthCode}
                                className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                            >
                                <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black">
                                    인증번호 발송
                                </span>
                            </button>
                            <input
                                type="text"
                                placeholder="6자리 입력"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 mt-2"
                                onChange={handleAuthCodeChange}
                            />
                            <p className="text-gray-600 text-sm mt-2">*인증번호를 입력해 주세요</p>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                    >
                        <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0 text-black">
                            확인
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FindPW;
