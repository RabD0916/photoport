import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from "axios";

const SignUp = ({ onSignUpSuccess }) => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;

    const [formData, setFormData] = useState({
        id: '',
        password: '',
        userNick: '',
        phone: '',
        birth: '',
        email: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // 이메일 유효성 검사 함수
    const isValidEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    // 전화번호 유효성 검사 함수
    const isValidPhone = (phone) => {
        const phonePattern = /^\d{10,11}$/; // 10자리 또는 11자리 숫자만 유효
        return phonePattern.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 비어있는 항목 검사
        const isEmpty = Object.values(formData).some(x => x === '');
        if (isEmpty) {
            alert("모든 항목은 필수 입력입니다");
            return;
        }

        // 이메일 형식 검사
        if (!isValidEmail(formData.email)) {
            alert("유효하지 않은 이메일 형식입니다.");
            return;
        }

        // 전화번호 형식 검사
        if (!isValidPhone(formData.phone)) {
            alert("유효하지 않은 전화번호 형식입니다. (10~11자리 숫자)");
            return;
        }

        try {
            const response = await axios.post(`${SERVER_IP}/api/join`, formData);
            console.log(response.data);
            if (response.status === 200) {
                console.log("Success : ", response.status);
                navigate("/login");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="bg-white rounded-lg py-5">
            <div className="container flex flex-col mx-auto bg-white pt-12 my-5 border-4 border-sky-200 rounded-2xl w-4/5">
                <div
                    className={"flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable"}>
                    <div className={"flex items-center justify-center w-full lg:p-12"}>
                        <div className={"flex items-center xl:p-10"}>
                            <form className={"flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"}
                                  onSubmit={handleSubmit} method="post">
                                <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">Register</h3>
                                <p className="mb-4 text-grey-700">Enter your Information</p>
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
                                <label htmlFor="Nickname"
                                       className="mb-2 text-sm text-start text-grey-900">Nickname*</label>
                                <input type="text" placeholder="Enter a NickName"
                                       name="userNick" value={formData.userNick}
                                       onChange={handleChange}
                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border"/>
                                <label htmlFor="tel" className="mb-2 text-sm text-start text-grey-900">Phone*</label>
                                <input type="tel" placeholder="Enter a PhoneNumber"
                                       name="phone" value={formData.phone}
                                       onChange={handleChange}
                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border"/>
                                <label htmlFor="birth" className="mb-2 text-sm text-start text-grey-900">Birth*</label>
                                <input type="date" placeholder="Enter a Birth"
                                       name="birth" value={formData.birth}
                                       onChange={handleChange}
                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border"/>
                                <label htmlFor="email" className="mb-2 text-sm text-start text-grey-900">Email*</label>
                                <input type="email" placeholder="Enter a Email"
                                       name="email" value={formData.email}
                                       onChange={handleChange}
                                       className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border"/>
                                <button
                                    type={"submit"}
                                    className="mt-3 w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-black transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-blue-300">Sign
                                    up
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    // <div className={"main_body"}>
    //     <h1 className="sign_font">회원가입</h1>
    //     <div className="join_style">
    //         <form onSubmit={handleSubmit}>
    //             <p className="sign_p">*아이디 </p>
    //             <input
    //                 type="text"
    //                 name="id"
    //                 value={formData.id}
    //                 className="sign_input"
    //                 onChange={handleChange}
    //             />
    //             <br/>
    //             <p className="sign_p">*비밀번호 </p>
    //             <input
    //                 type="password"
    //                 name="password"
    //                 value={formData.password}
    //                 className="sign_input"
    //                 onChange={handleChange}
    //             />
    //             <br/>
    //             <p className="sign_p">*닉네임 </p>
    //             <input
    //                 type="text"
    //                 name="userNick"
    //                 value={formData.userNick}
    //                 className="sign_input"
    //                 onChange={handleChange}
    //             />
    //             <br/>
    //             <p className="sign_p">*전화번호 </p>
    //             <input
    //                 type="tel"
    //                 name="phone"
    //                 value={formData.phone}
    //                 className="sign_input"
    //                 onChange={handleChange}
    //             />
    //             <br/>
    //             <p className="sign_p">*생년월일 </p>
    //             <input
    //                 type="date"
    //                 name="birth"
    //                 value={formData.birth}
    //                 className="sign_input"
    //                 onChange={handleChange}
    //             />
    //             <br/>
    //             <p className="sign_p">*이메일 </p>
    //             <input
    //                 type="email"
    //                 name="email"
    //                 value={formData.email}
    //                 className="sign_input"
    //                 onChange={handleChange}
    //             />
    //             <br/>
    //             <button type="submit" className="next_input">가입하기</button>
    //         </form>
    //     </div>
    // </div>
)
    ;
};

export default SignUp
