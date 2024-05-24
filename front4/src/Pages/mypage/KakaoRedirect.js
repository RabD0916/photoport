import React, { useEffect } from 'react';
import axiosInstance from "../../axiosInstance";
import { useNavigate } from 'react-router-dom';

const KakaoRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');

        const fetchTokens = async () => {
            try {
                const response = await axiosInstance.post('/kakao/login', { code });
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('id', response.data.id);
                localStorage.setItem('userNick', response.data.userNick);
                navigate('/');
            } catch (error) {
                console.error('Login failed', error);
                navigate('/login');
            }
        };

        if (code) {
            fetchTokens();
        }
    }, [navigate]);

    return <div>로그인 중입니다!! 잠시만 기다려주세요..</div>;
};

export default KakaoRedirect;