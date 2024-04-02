import React from "react";
import "./css/MyPage.scss";
import test from "../../img/photoport.png";


function MyPage(){
    return(
        <>
            <div className={"main-mypage"}>
                <div className={"myprofile"}>
                    <div className={"pro-image"}>사진 삽입</div>
                    <div className={"pro-nick"}>
                        <div className={"pro-name"}>닉네임</div>
                       <button>수정</button>
                    </div>
                    <div className={"follow"}>팔로우</div>
            <div className={"my-pageNav"}><button>게시판</button><button>친구</button></div>
                </div>
            </div>
            <div className={"content-list"}>
                <div className={"EventItem"}>
                    <img src={test} className={"Eventimage"} alt={"이벤트 사진"}/>
                    <div className={"EventContent"}>
                        포토포트 여러분의 곁으로 곧 찾아 갑니다!
                    </div>
                </div>
                <div className={"EventItem"}>
                    <img src={test} className={"Eventimage"} alt={"이벤트 사진"}/>
                    <div className={"EventContent"}>
                        포토포트 여러분의 곁으로 곧 찾아 갑니다!
                    </div>
                </div>
                <div className={"EventItem"}>
                    <img src={test} className={"Eventimage"} alt={"이벤트 사진"}/>
                    <div className={"EventContent"}>
                        포토포트 여러분의 곁으로 곧 찾아 갑니다!
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyPage;