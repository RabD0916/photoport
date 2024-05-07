import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./BoardCss/BoardList.scss";
import styled from 'styled-components';
import heart from "../../img/like.png";
import like from "../../img/like.png";
import sub from "../../img/sub.png";
import comment from "../../img/comment.png";
const GalleryContainer = styled.div`
  width: 80%;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
`;

const BoardList = () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);

    // const handleCreate =() =>{
    //     navigate('/BoardWrite');
    // }
    const getBoardList = async () => {
        const resp = await axios.get('http://localhost:8080/api/boards',
            {
                headers : {
                    Authorization : `Bearer ${accessToken}`
                }
            });// 2) 게시글 목록 데이터에 할당
        console.log(resp);
        console.log(resp.data);
        setBoardList(resp.data); // 3) boardList 변수에 할당

        const pngn = resp.pagination;
        console.log(pngn);
    };

    const moveToWrite = () => {
        navigate('/Boardwrite');
    };

    useEffect(() => {
        getBoardList().then(r => console.log(r)); // 1) 게시글 목록 조회 함수 호출
    }, []);

    const open_board =() =>{
        window.open("boardDetail","_blank","width=100");//url+게시글 아이디 모달창
    }
    return (
        <div>
            <div>
                <button onClick={moveToWrite}>글쓰기</button>
            </div>
            {/*<div className="main_board">*/}
            {/*    <div className={"board_select"}></div>*/}
            {/*    <div className="board_list">*/}
            {/*        {boardList.map((board) => (*/}
            {/*            <div key={board.idx} className="board_item">*/}
            {/*                <div className="title_name">{board.title}</div>*/}
            {/*                <Link to={`/board/${board.idx}`}>*/}
            {/*                    <img className="board_img" src={board.file} alt={board.title}/>*/}
            {/*                </Link>*/}
            {/*                <div className={"click_evt"}>*/}
            {/*                    <img className={"heart_img"} src={heart} alt={"좋아요"}/>*/}
            {/*                    <img className={"comment_img"} src={comment} alt={"댓글"}/>*/}
            {/*                    <img className={"sub_img"} src={sub} alt={"북마크"}/>*/}
            {/*                </div>*/}
            {/*                <div className="content_name">{board.content}</div>*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*        /!* 필요한 만큼 게시글 추가 *!/*/}
            {/*    </div>*/}
            {/*</div>*/}
            <GalleryContainer>
            <div className="main_board" onClick={open_board}>
                <div className={"board_select"}></div>
                <div className="board_list">
                        <div className="board_item">
                            <div className={"img_box"}>
                            <img className="board_img" src={heart} alt="#"/>
                            </div>
                            <div className={"click_evt"}>
                                <img src={like} alt={"좋아요"}/>
                                <img src={comment} alt={"댓글"}/>
                                <img src={sub} alt={"북마크"}/>
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
            </GalleryContainer>
        </div>
    );
};

export default BoardList;