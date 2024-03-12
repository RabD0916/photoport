import React from "react";
import "../Css/footer.css";
function footer(){
    return(
        <div className="mainfooter">
            <div className="footerfirst">
                <div className="footerleft">
                    <div>이용약관 개인정보처리방침</div>
                    <div>조이름: 카고</div>
                    <div>조원 : 정재헌 ,김영우,신철규,권혁,유현수</div>
                    <div>문의:wogjs@naver.com</div>
                    <div>
                        <img className="application" src="/444.png" alt="인생네컷어플" />
                    </div>
                    <div>
                        <img className="googlebutton" src="/googleplay.png" alt="다운로드버튼" />
                    </div>
                </div>
                <div className="footerright">
                    <img className="map" src="/map.jpg" alt="지도" />
                </div>
            </div>
        </div>
    )
}

export default footer;