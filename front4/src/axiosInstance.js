import axios from 'axios';
const SERVER_IP = process.env.REACT_APP_SERVER_IP;


// Axios 인스턴스 생성
const instance = axios.create({
    baseURL: `${SERVER_IP}/api`, // 서버의 기본 URL 설정
});

// 응답 인터셉터 추가
instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // 401 에러이고, 요청이 한 번도 재시도되지 않은 경우
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const userId = localStorage.getItem('id');

                // 새 액세스 토큰 요청
                const response = await axios.post(`${SERVER_IP}/api/token`, {
                    id: userId,
                    refreshToken: refreshToken
                });

                const accessToken = response.data.accessToken;
                localStorage.setItem('accessToken', accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // 원래 요청 다시 시도
                return axios(originalRequest);
            } catch (err) {
                console.error('Refresh token expired', err);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('id');
                window.location.href = '/login'; // 로그인 페이지로 리다이렉트
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;