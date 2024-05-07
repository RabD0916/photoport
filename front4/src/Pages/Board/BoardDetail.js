import heart from "../../img/like.png";
import React from "react";
import "./BoardCss/BoardList.scss";

const BoardDetail = () => {
    return (
        <div>
            <div className="main_board">
                <div className={"board_select"}></div>
                <div className="board_list">
                    <div className="board_item">
                        <div className={"img_box"}>
                            <img className="board_img" src={heart} alt="#"/>
                        </div>
                        <div className={"click_evt"}>
                            <img src="#" alt={"좋아요"}/>
                            <img src="#" alt={"댓글"}/>
                            <img src="#" alt={"북마크"}/>
                        </div>
                        <div className={"content_box"}>
                            <div className={"content_font"}>제목</div>
                            <div className="content_name">제목</div>
                            <div className={"content_font"}>태그</div>
                            <div className="content_name">태그</div>
                            <div className={"content_font"}>내용</div>
                            <div className="content_name">내용</div>
                        </div>
                    </div>
                    {/* 필요한 만큼 게시글 추가 */}
                </div>
            </div>
        </div>
    );
}
export default BoardDetail;