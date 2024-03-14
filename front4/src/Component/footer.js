import React from "react";
import "../Css/footer.css";
import Mainlogo from '../testttt/photoport.png';
function footer(){
    return(
        <div className="main_footer">
            <div className="footer_first">
                <div className="footer_left">
                    <div>이용약관 개인정보처리방침</div>
                    <div>조이름: 카고</div>
                    <div>조원 : 정재헌 ,김영우,신철규,권혁,유현수</div>
                    <div>문의:wogjs@naver.com</div>
                <hr className="Line"/>
                    <div>
                        <img className="application" src={Mainlogo} alt="인생네컷어플" />
                        <img className="app_logo" src="/444.png" alt="인생네컷어플" />
                    </div>

                    <div>
                        <img className="google_button" src="/googleplay.png" alt="다운로드버튼" />
                    </div>

                </div>
                <div className="footer_right">
                    <img className="naver_map" src="/map.jpg" alt="지도" />
                    {/*<div className={"linkiss"}>링크들</div>*/}
                </div>
            </div>

        </div>
    )
}

export default footer;