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
                <div className="main_board2">
                    <div className={"board_select2"}></div>
                    <div className="board_list2">
                        <div className="board_item2">
                            <div className={"img_box2"}>
                                <img className="board_img2" src={heart} alt="#"/>
                            </div>
                            <div className={"click_evt2"}>
                                <img src="#" alt={"좋아요"}/>
                                <img src="#" alt={"댓글"}/>
                                <img src="#" alt={"북마크"}/>
                            </div>
                            <div className={"content_box2"}>
                                <div className={"content_font2"}>제목</div>
                                <div className="content_name2">제목</div>
                                <div className={"content_font2"}>태그</div>
                                <div className="content_name2">태그</div>
                                <div className={"content_font2"}>내용</div>
                                <div className="content_name2">내용</div>
                            </div>
                        </div>
                        {/* 필요한 만큼 게시글 추가 */}
                    </div>
                </div>
                <div className="main_board2">
                    <div className={"board_select2"}></div>
                    <div className="board_list2">
                        <div className="board_item2">
                            <div className={"img_box2"}>
                                <img className="board_img2" src={heart} alt="#"/>
                            </div>
                            <div className={"click_evt2"}>
                                <img src="#" alt={"좋아요"}/>
                                <img src="#" alt={"댓글"}/>
                                <img src="#" alt={"북마크"}/>
                            </div>
                            <div className={"content_box2"}>
                                <div className={"content_font2"}>제목</div>
                                <div className="content_name2">제목</div>
                                <div className={"content_font2"}>태그</div>
                                <div className="content_name2">태그</div>
                                <div className={"content_font2"}>내용</div>
                                <div className="content_name2">내용</div>
                            </div>
                        </div>
                        {/* 필요한 만큼 게시글 추가 */}
                    </div>
                </div>
                <div className="main_board2">
                    <div className={"board_select2"}></div>
                    <div className="board_list2">
                        <div className="board_item2">
                            <div className={"img_box2"}>
                                <img className="board_img2" src={heart} alt="#"/>
                            </div>
                            <div className={"click_evt2"}>
                                <img src="#" alt={"좋아요"}/>
                                <img src="#" alt={"댓글"}/>
                                <img src="#" alt={"북마크"}/>
                            </div>
                            <div className={"content_box2"}>
                                <div className={"content_font2"}>제목</div>
                                <div className="content_name2">제목</div>
                                <div className={"content_font2"}>태그</div>
                                <div className="content_name2">태그</div>
                                <div className={"content_font2"}>내용</div>
                                <div className="content_name2">내용</div>
                            </div>
                        </div>
                        {/* 필요한 만큼 게시글 추가 */}
                    </div>
                </div>
                <div className="main_board2">
                    <div className={"board_select2"}></div>
                    <div className="board_list2">
                        <div className="board_item2">
                            <div className={"img_box2"}>
                                <img className="board_img2" src={heart} alt="#"/>
                            </div>
                            <div className={"click_evt2"}>
                                <img src="#" alt={"좋아요"}/>
                                <img src="#" alt={"댓글"}/>
                                <img src="#" alt={"북마크"}/>
                            </div>
                            <div className={"content_box2"}>
                                <div className={"content_font2"}>제목</div>
                                <div className="content_name2">제목</div>
                                <div className={"content_font2"}>태그</div>
                                <div className="content_name2">태그</div>
                                <div className={"content_font2"}>내용</div>
                                <div className="content_name2">내용</div>
                            </div>
                        </div>
                        {/* 필요한 만큼 게시글 추가 */}
                    </div>
                </div>
                <div className="main_board2">
                    <div className={"board_select2"}></div>
                    <div className="board_list2">
                        <div className="board_item2">
                            <div className={"img_box2"}>
                                <img className="board_img2" src={heart} alt="#"/>
                            </div>
                            <div className={"click_evt2"}>
                                <img src="#" alt={"좋아요"}/>
                                <img src="#" alt={"댓글"}/>
                                <img src="#" alt={"북마크"}/>
                            </div>
                            <div className={"content_box2"}>
                                <div className={"content_font2"}>제목</div>
                                <div className="content_name2">제목</div>
                                <div className={"content_font2"}>태그</div>
                                <div className="content_name2">태그</div>
                                <div className={"content_font2"}>내용</div>
                                <div className="content_name2">내용</div>
                            </div>
                        </div>
                        {/* 필요한 만큼 게시글 추가 */}
                    </div>
                </div>
                <div className="main_board2">
                    <div className={"board_select2"}></div>
                    <div className="board_list2">
                        <div className="board_item2">
                            <div className={"img_box2"}>
                                <img className="board_img2" src={heart} alt="#"/>
                            </div>
                            <div className={"click_evt2"}>
                                <img src="#" alt={"좋아요"}/>
                                <img src="#" alt={"댓글"}/>
                                <img src="#" alt={"북마크"}/>
                            </div>
                            <div className={"content_box2"}>
                                <div className={"content_font2"}>제목</div>
                                <div className="content_name2">제목</div>
                                <div className={"content_font2"}>태그</div>
                                <div className="content_name2">태그</div>
                                <div className={"content_font2"}>내용</div>
                                <div className="content_name2">내용</div>
                            </div>
                        </div>
                        {/* 필요한 만큼 게시글 추가 */}
                    </div>
                </div>   <div className="main_board2">
                <div className={"board_select2"}></div>
                <div className="board_list2">
                    <div className="board_item2">
                        <div className={"img_box2"}>
                            <img className="board_img2" src={heart} alt="#"/>
                        </div>
                        <div className={"click_evt2"}>
                            <img src="#" alt={"좋아요"}/>
                            <img src="#" alt={"댓글"}/>
                            <img src="#" alt={"북마크"}/>
                        </div>
                        <div className={"content_box2"}>
                            <div className={"content_font2"}>제목</div>
                            <div className="content_name2">제목</div>
                            <div className={"content_font2"}>태그</div>
                            <div className="content_name2">태그</div>
                            <div className={"content_font2"}>내용</div>
                            <div className="content_name2">내용</div>
                        </div>
                    </div>
                    {/* 필요한 만큼 게시글 추가 */}
                </div>
            </div>   <div className="main_board2">
                <div className={"board_select2"}></div>
                <div className="board_list2">
                    <div className="board_item2">
                        <div className={"img_box2"}>
                            <img className="board_img2" src={heart} alt="#"/>
                        </div>
                        <div className={"click_evt2"}>
                            <img src="#" alt={"좋아요"}/>
                            <img src="#" alt={"댓글"}/>
                            <img src="#" alt={"북마크"}/>
                        </div>
                        <div className={"content_box2"}>
                            <div className={"content_font2"}>제목</div>
                            <div className="content_name2">제목</div>
                            <div className={"content_font2"}>태그</div>
                            <div className="content_name2">태그</div>
                            <div className={"content_font2"}>내용</div>
                            <div className="content_name2">내용</div>
                        </div>
                    </div>
                    {/* 필요한 만큼 게시글 추가 */}
                </div>
            </div>
                <div className="main_board2">
                    <div className={"board_select2"}></div>
                    <div className="board_list2">
                        <div className="board_item2">
                            <div className={"img_box2"}>
                                <img className="board_img2" src={heart} alt="#"/>
                            </div>
                            <div className={"click_evt2"}>
                                <img src="#" alt={"좋아요"}/>
                                <img src="#" alt={"댓글"}/>
                                <img src="#" alt={"북마크"}/>
                            </div>
                            <div className={"content_box2"}>
                                <div className={"content_font2"}>제목</div>
                                <div className="content_name2">제목</div>
                                <div className={"content_font2"}>태그</div>
                                <div className="content_name2">태그</div>
                                <div className={"content_font2"}>내용</div>
                                <div className="content_name2">내용</div>
                            </div>
                        </div>
                        {/* 필요한 만큼 게시글 추가 */}
                    </div>
                </div>
                <div className="main_board2">
                    <div className={"board_select2"}></div>
                    <div className="board_list2">
                        <div className="board_item2">
                            <div className={"img_box2"}>
                                <img className="board_img2" src={heart} alt="#"/>
                            </div>
                            <div className={"click_evt2"}>
                                <img src="#" alt={"좋아요"}/>
                                <img src="#" alt={"댓글"}/>
                                <img src="#" alt={"북마크"}/>
                            </div>
                            <div className={"content_box2"}>
                                <div className={"content_font2"}>제목</div>
                                <div className="content_name2">제목</div>
                                <div className={"content_font2"}>태그</div>
                                <div className="content_name2">태그</div>
                                <div className={"content_font2"}>내용</div>
                                <div className="content_name2">내용</div>
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