import React, { useEffect, useRef } from "react";
import "../Css/footer.css";
import Mainlogo from '../testttt/photoport.png';
function Footer(){

    return(
        <div className="main_footer">
            <div className="footer_first">
                <div className="footer_left">
                    <p>이용약관 개인정보처리방침</p>
                    <p>조이름: 카고</p>
                    <p>조원 : 정재헌 ,김영우,신철규,권혁,유현수</p>
                    <p>문의:wogjs@naver.com</p>
                    <hr className="Line"/>
                    <div className={"application"}>
                        <img className="app_logo" src={Mainlogo} alt="인생네컷어플"/>
                        <img className="google_button" src="/googleplay.png" alt="다운로드버튼"/>
                    </div>
                </div>
                <div className="footer_right">
                    <img className="naver_map" src="/map.jpg" alt="지도"/>
                    {/*<div className={"linkiss"}>링크들</div>*/}
                </div>
                <div className={"footer_right"}>

                </div>
            </div>

        </div>
    )
}

export default Footer;