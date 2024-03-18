import React, { useState } from 'react';
import {Link} from "react-router-dom";
const join=() =>{
    return(
        <div>
            <h2>회원가입</h2>
            <section className="join_style">
                <h3>회원가입 약관동의 및 본인인증단계 입니다.</h3>
                <div className="all_agree"> 전체동의<input type="checkbox" /></div>
                <h4 className="check_agree">*홈페이지 이용약관 동의 (필수)<span> 동의<input type="checkbox" /></span></h4>
                <textarea name="" className="privacy_scroll">

                </textarea>
                <h4 className="check_agree">개인정보 수집 및 이용동의 (필수)<span> 동의<input type="checkbox" /></span></h4>
                <textarea name="" className="privacy_scroll">

                </textarea>
                <h4 className="check_agree">광고성 정보 수신동의 (선택)<span> 동의<input type="checkbox" /></span></h4>
                <textarea name="" className="privacy_scroll">

                </textarea>
                <h4 className="check_agree">회원가입 유의사항</h4>
                <textarea name="" className="privacy_scroll">

                </textarea>
                <Link to={"/signup"} className={"next_button"}>다음</Link>
            </section>
        </div>
    )
}
export default join;