import React, { useState } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Login = ({ handleLogin }) => { // 함수 컴포넌트 이름을 대문자로 변경

    const handleKakaoLogin = () => {
        window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=ab365f86f03b47b75738f7a3f6bd64ab&redirect_uri=http://localhost:3000/oauth/kakao&response_type=code`;
    };

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
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
            console.log(formData);
            const response = await axios.post('http://localhost:8080/api/signin', formData);
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;


            console.log("accessToken 값 : " + accessToken);
            console.log("refreshToken 값 : " + refreshToken);

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('id', formData.id);
            localStorage.setItem('userNick', response.data.userNick);
            navigate("/")
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className="bg-white rounded-lg py-5">
            <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
                <div className={"flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable"}>
                    <div className={"flex items-center justify-center w-full lg:p-12"}>
                        <div className={"flex items-center xl:p-10"}>
                            <form className={"flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"} onSubmit={handleSubmit} method="post">
                                <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">Sign In</h3>
                                <p className="mb-4 text-grey-700">Enter your ID and password</p>
                                <div
                                    className={"flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl" +
                                        "text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-4 focus:ring-grey-300"}>
                                </div>
                                <label htmlFor="id" className="mb-2 text-sm text-start text-grey-900">ID*</label>
                                <input type="text" placeholder="Enter a ID"
                                       name="id" value={formData.id}
                                       onChange={handleChange}
                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border"/>
                                <label htmlFor="password"
                                       className="mb-2 text-sm text-start text-grey-900">Password*</label>
                                <input type="password" placeholder="Enter a password" name={"password"}
                                       value={formData.password} onChange={handleChange}
                                       className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border"/>
                                <div className="flex flex-row justify-between mb-8">
                                    <Link to={"/findID"}
                                          className="mr-4 text-sm font-medium text-purple-blue-500">Forget ID?</Link>
                                    <Link to={"/findPW"}
                                          className="mr-4 text-sm font-medium text-purple-blue-500">Forget password?</Link>
                                </div>
                                <button
                                    className="mt-3 w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-black transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-300">Sign
                                    In
                                </button>
                                <img className="h-10 mx-auto" src="/kakao_login.png" alt="카카오 로그인"
                                     onClick={handleKakaoLogin} style={{cursor: 'pointer'}}/>
                                <p className="mt-10 text-sm leading-relaxed text-gray-900">Not registered yet?
                                    <Link to={"/Signup"} className="font-bold text-gray-700"> Create an Account</Link>
                                </p>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
