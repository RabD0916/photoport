import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Notice.css'

/* createdAt 수정해야함*/
/*createdBy 도 로그인된 관리자계정으로 수정*/
const NoticeShow = ({id, title, createdBy, contents, tags, createdAt}) => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");

    const moveToUpdate = () => {
        navigate('/update/' + id);
    };
    /*axios url 수정해야함 */
    const deleteNotice = async () => {
        try {
            const response = await axios.delete(`${SERVER_IP}/api/delete/board/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("Post deleted:", response);
            // 게시글 삭제 후 모달 닫기 및 게시글 목록 새로고침
            alert("해당 게시글이 삭제되었습니다.")
            await NoticeShow;
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const moveToList = () => {
        navigate('/Notice');
    };
    return (
        <div>
            <div>
                <h2>게시글 아이디 : {id}</h2>
                <h2>제목 :  {title}</h2>
                <h5>작성자 :  {createdBy}</h5>
                <hr/>
                <p>내용  :  {contents}
                </p>
                <hr/>
                <p>
                   태그:  {tags}
                </p>
                <hr/>
                <p>
                   작성일 :   {createdAt}
                </p>
            </div>
            <div>
                <button id='cancle_save_btn' onClick={moveToUpdate}>수정</button>
                <button id='cancle_save_btn' onClick={deleteNotice}>삭제</button>
                <button id='cancle_save_btn' onClick={moveToList}>목록</button>
            </div>
        </div>

    );
};

export default NoticeShow;