import React, { useState } from 'react';
import {Link} from "react-router-dom";
const join=() =>{
    return(
        <div>
            <h2>회원가입</h2>
            <section>
                <h4>회원가입 약관동의 및 본인인증단계 입니다.</h4>
                <h4>홈페이지 이용약관 동의 (필수)</h4>
                <h4>개인정보 수집 및 이용동의 (필수)</h4>
                <h4>광고성 정보 수신동의 (선택)</h4>
                <h4>회원가입 유의사항</h4>
                <Link to={"/signup"} className={"sign"}>다음</Link>
                <br />
            </section>
        </div>
    )
}
export default join;