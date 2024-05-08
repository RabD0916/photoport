import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import styled from 'styled-components';
import heart from "../../../img/like.png";
import "../Number/First.scss";
import like from "../../../img/like.png";
import comment from "../../../img/comment.png";
import sub from "../../../img/sub.png";

const GalleryContainer = styled.div`
  display: flex;
  flex: 0 0 10%; /* 각 항목이 4개가 나열될 수 있도록 25%의 너비를 설정 */
  flex-wrap: wrap;
  margin: 0;
`;

const First = () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const [cate, setCate] = useState([]);
    const [boardList, setBoardList] = useState([]);

    useEffect(() => {
        console.log(userId);
        console.log(accessToken);
        async function getCategoryList() {
            const result = await axios.get(
                `http://localhost:8080/api/sendCategory/${userId}`,
                {
                    headers : {
                        Authorization : `Bearer ${accessToken}`
                    }
                }
            );
            return result.data;
        }
        getCategoryList().then(r => setCate(r));
    }, [userId]);

    const getUserBoardList = async () => {
        try {
            const resp = await axios.get('http://localhost:8080/api/myBoards', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(resp);
            console.log(resp.data);
            setBoardList(resp.data);
        } catch (error) {
            console.error("Error fetching board list:", error);
        }
    };

    useEffect(() => {
        getUserBoardList();
    }, []);

    return(
        <div>
            <GalleryContainer>
                <div className="main_board">
                    {boardList.map(post => (
                        <div key={post.id} className="board_item">
                            {/* 게시글 내용 표시 */}
                            <div className={"img_box"}>
                                {/* 배열의 첫 번째 이미지만 표시. 배열이 비어있지 않은지 확인 필요 */}
                                {post.media.length > 0 && (
                                    <img className="board_img" src={`./images/${post.writer}/${post.media[0].categoryName}/${post.media[0].mediaName}`} alt="#"/>
                                )}
                            </div>
                            <div className={"click_evt"}>
                                <img className={"nav-img"} src={like} alt={"좋아요"}/><p>{post.like}</p>
                                <img className={"nav-img"} src={comment} alt={"댓글"}/>
                                <img className={"nav-img"} src={sub} alt={"북마크"}/><p>{post.bookmark}</p>
                                <p className={"view_"}>view{post.view}</p>
                            </div>
                            <div className={"content_box"}>태그<div>{post.tags}</div></div>
                            <div className={"content_box"}>내용<div>{post.content}</div></div>
                        </div>
                    ))}
                </div>
            </GalleryContainer>
        </div>
    )

}

export default First;