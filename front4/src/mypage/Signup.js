import React, { useState, useRef } from 'react';
import "./css/login.css";
import { useNavigate } from "react-router-dom";
const Signup=() =>{
    const [sign_id,setIdValue] = useState('')
    const [sign_pass,setPassValue] = useState('')
    const [sign_pass_ch,setPassChValue] = useState('')
    const [sign_email,setEmailValue] = useState('');
    const [sign_phone,setPhoneValue] = useState('');
    const navigate = useNavigate();
    const inputId = useRef(null);
    const inputPass = useRef(null);
    const inputPassCh = useRef(null);
    const inputEmail = useRef(null);
    const inputPhone = useRef(null);
    const handleIdChange = (event) => {
        setIdValue(event.target.value);
    };
    const handlePassChange = (event) => {
        setPassValue(event.target.value);
    };
    const handlePassCheckChange = (event) => {
        setPassChValue(event.target.value);
    }
    const handleEmailChange = (event) => {
        setEmailValue(event.target.value);
    }
    const handlePhoneChange = (event) => {
        setPhoneValue(event.target.value);
    }
    const isValidEmail = (e) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(e);
    }
    const sign_handle = (e) => {
        if (sign_id.trim() === "") {
            alert('아이디를 입력해주세요.');
            inputId.current.focus();
            setIdValue('');
            return;
        }
        if (sign_pass.trim()==='') {
            alert("비밀번호를 입력해주세요");
            inputPass.current.focus();
            setPassValue('');
            return;
        }else{
            if(sign_pass.trim()!=sign_pass_ch.trim()){
                inputPassCh.current.focus();
                alert("비밀번호를 확인해주세요");
                setPassChValue('');
                return;
            }
        }
        if (sign_email.trim()==='') {
            inputEmail.current.focus();
            alert("이메일을 입력해주세요");
            setEmailValue('');
            return;
        }else{
            if(!isValidEmail(sign_email.trim())){
                inputEmail.current.focus();
                alert("이메일 형식을 지켜주세요!");
                setEmailValue('');
                return;
            }
        }
        if (sign_phone.trim()==='') {
            inputPhone.current.focus();
            alert("핸드폰번호를 입력해주세요");
            setPhoneValue('');
            return;
        }
        navigate("/");
    }

    return(
        <div>
            <h1>회원가입</h1>
            <div className="join_style">
            <form action="" method="post">
                <p className="sign_p">*아이디  </p><input ref={inputId} type="text" className="sign_input" name={sign_id} onChange={handleIdChange} placeholder="아이디를 입력하세요."/>
                <p className="sign_p">*비밀번호  </p><input ref={inputPass}type="password" className="sign_input" name={sign_pass} onChange={handlePassChange} placeholder="비밀번호를 입력하세요."/>
                <p className="sign_p">*비밀번호 확인  </p><input ref={inputPassCh}type="password" className="sign_input" onChange={handlePassCheckChange} placeholder="비밀번호 확인."/>
                <p className="sign_p">*이메일  </p>
                <input ref={inputEmail} type="text" className="sign_input" name={sign_email} onChange={handleEmailChange} placeholder="이메일 입력"/>
                <p className="sign_p">*전화번호  </p><input ref={inputPhone} type="text" className="sign_input" name={sign_phone} onChange={handlePhoneChange} placeholder={"010-0000-0000"}/>
            </form>
            <input className="next_input" type="submit" onClick={sign_handle} value="회원가입"/>
            </div>
        </div>
    )
}
export default Signup;