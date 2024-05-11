import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import NoticeShow from './NoticeShow';

const NoticeDetail = () => {
    const { id } = useParams();
    const userId = localStorage.getItem("id");
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState({});
    const accessToken = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const getNotice = async () => {
        try {
            const resp = await axios.get(`http://localhost:8080/api/board/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // 날짜 포매팅
            const date = new Date(...resp.data.createdAt);
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;

            // 데이터 세팅
            setNotice({
                ...resp.data,
                createdAt: formattedDate,
                tags: resp.data.tags.filter(tag => tag).join(', ') // 빈 문자열 제거 후 문자열로 변환
            });
            setLoading(false);
        } catch (error) {
            console.error('공지사항 불러오기 실패 : ', error);
        }
    };

    const moveToUpdate = () => {
        navigate('/update/' + id);
    };
    /*axios url 수정해야함 */
    const deleteNotice = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/delete/board/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log("Post deleted:", response);
            // 게시글 삭제 후 모달 닫기 및 게시글 목록 새로고침
            alert("해당 게시글이 삭제되었습니다.")
            navigate('/Notice');
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const moveToList = () => {
        navigate('/Notice');
    };

    useEffect(() => {
        getNotice();
    }, [id]); // id 값이 변경될 때마다 getNotice 함수를 호출

    return (
        <div>
            {loading ? (
                <h2>Loading...</h2>
            ) : (
                <div>
                    {/*<h2>게시글 아이디 : {notice.id}</h2>*/}
                    <h2>제목 : {notice.title}</h2>
                    <h5>작성자 : {notice.writerId}</h5>
                    <hr/>
                    <p>내용 : {notice.content}
                    </p>
                    <hr/>
                    <p>
                        태그: {notice.tags}
                    </p>
                    <hr/>
                    <p>
                        작성 일자 : {notice.createdAt}
                    </p>
                    {userId === "ADMIN" && (
                        <div>
                            <button id='cancle_save_btn' onClick={moveToUpdate}>수정</button>
                            <button id='cancle_save_btn' onClick={deleteNotice}>삭제</button>
                            <button id='cancle_save_btn' onClick={moveToList}>목록</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NoticeDetail;