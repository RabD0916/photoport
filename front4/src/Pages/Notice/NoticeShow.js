import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Notice.css'

/* createdAt 수정해야함*/
/*createdBy 도 로그인된 관리자계정으로 수정*/
const NoticeShow = ({ id, title, createdBy, contents, tags, createdAt}) => {
    const navigate = useNavigate();

    const moveToUpdate = () => {
        navigate('/update/' + id);
    };
    /*axios url 수정해야함 */
    const deleteNotice = async () => {
        if (window.confirm('게시글을 삭제하시겠습니까?')) {
            await axios.delete(`http://localhost:8080/Notice/${id}`).then((res) => {
                alert('삭제되었습니다.');
                navigate('/Notice');
            });
        }
    };

    const moveToList = () => {
        navigate('/Notice');
    };
    return (
        <div>
            <div>
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