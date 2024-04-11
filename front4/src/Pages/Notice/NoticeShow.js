import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Notice.css'

/* createdAt 수정해야함*/
/*createdBy 도 로그인된 관리자계정으로 수정*/
const NoticeShow = ({ id, title, contents, createdBy, fileUrl /*createdAt*/}) => {
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
                <h2>{title}</h2>
                <h5>{createdBy}</h5>
                <hr/>
                <p>{contents}
                    {fileUrl && <img src={fileUrl} alt="첨부 이미지" />}
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