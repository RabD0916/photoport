import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import styled from 'styled-components';
import heart from "../../../img/heart.png";
import "../Number/First.scss";

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
    return(
        <div>
            <GalleryContainer>
                {/*{cate.map((cateId) => (*/}
                {/*    <Link key={cateId[0]} to={"/gallery/" + userId + "/" + cateId[0]} className={"cate"}>*/}
                {/*        {cateId[1] !== "Empty" ?*/}
                {/*            <img className={"cate-image"} src={"/images/" + userId + "/" + cateId[0] + "/" + cateId[1]}*/}
                {/*                 alt={cateId[1]}*/}
                {/*            ></img>*/}
                {/*            : <div className={"not_box"}></div>}*/}
                {/*        <div*/}
                {/*            className={"cate-name"}>*/}
                {/*            /!*{decodeURI(decodeURIComponent(cateId[0].replaceAll("&", "%")))}*!/*/}
                {/*        </div>*/}
                {/*    </Link>*/}
                {/*))}*/}
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
                </GalleryContainer>
        </div>
    )

}

export default First;