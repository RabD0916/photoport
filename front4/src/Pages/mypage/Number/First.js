import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import styled from 'styled-components';
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
    const [profileImage, setProfileImage] = useState(null);
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
    useEffect(() => {
        {boardList.map(post => (
            axios.get(`http://localhost:8080/api/profile/${post.writerId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setProfileImage(response.data.userProfile);
                })
                .catch(error => console.error("Failed to load profile image", error))
        ))}
    })
    return(
        <div>
            <GalleryContainer>
                <div className="main_board2">
                    {boardList.map(post => (
                        <div key={post.id} className="board_item2">
                            {/* 게시글 내용 표시 */}
                            {post.title}
                            <div className={"board_content2"}>
                                <img src={profileImage} alt="Profile" className="profile2" />
                                {post.writerName}</div>
                            <div className={"img_box2"}>
                                {/* 배열의 첫 번째 이미지만 표시. 배열이 비어있지 않은지 확인 필요 */}
                                {post.media.length > 0 && (
                                    <img className="board_img2" src={`./images/${post.writerId}/${post.media[0].categoryName}/${post.media[0].mediaName}`} alt="#"/>
                                )}
                            </div>
                            <div className={"click_evt2"}>
                                <img className={"nav-img2"} src={like} alt={"좋아요"}/><p>{post.like}</p>
                                <img className={"nav-img2"} src={comment} alt={"댓글"}/>
                                <img className={"nav-img2"} src={sub} alt={"북마크"}/><p>{post.bookmark}</p>
                                <p className={"view_2"}>view{post.view}</p>
                            </div>
                            <div className={"content_box2"}>태그<div>{post.tags}</div></div>
                        </div>
                    ))}
                </div>
            </GalleryContainer>
        </div>
    )

}

export default First;