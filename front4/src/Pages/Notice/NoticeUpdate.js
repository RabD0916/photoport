import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Notice from "./Notice";

const NoticeUpdate = () =>{
    const navigate = useNavigate();
    const { id } = useParams();
    const [NoticeShow, setNotice] = useState({
        id: 0,
        title: '',
        createdBy: '',
        contents: '',
    });

    const { title, createdBy, contents } = NoticeShow; //비구조화 할당

    const onChange = (event) => {
        const { value, name } = event.target;
        setNotice({
            ...NoticeShow,
            [name]: value,
        });
    };
    const getNotice = async () => {
        /*axios url 수정 필요*/
        const resp = await (await axios.get(`http://localhost:8080/Notice/${id}`)).data;
        setNotice(resp.data);
    };

    const updateNotice = async () => {
        await axios.patch(`http://localhost:8080/Notice`, Notice).then((res) => {
            alert('수정되었습니다.');
            navigate('/Notice/' + id);
        });
    };

    const backToDetail = () => {
        navigate('/NoticeShow/' + id);
    };

    useEffect(() => {
        getNotice();
    }, []);
    /* 이미지 삭제 및 재첨부 기능 추가*/

    return (
        <div>
            <div>
                <span>제목</span>
                <input type="text" name="title" value={title} onChange={onChange} />
            </div>
            <br />
            <div>
                <span>작성자</span>
                <input type="text" name="createdBy" value={createdBy} readOnly={true} />
            </div>
            <br />
            <div>
                <span>내용</span>
                <textarea
                    name="contents"
                    cols="30"
                    rows="10"
                    value={contents}
                    onChange={onChange}
                ></textarea>
            </div>
            <br />
            <div>
                <button onClick={updateNotice}>수정</button>
                <button onClick={backToDetail}>취소</button>
            </div>
        </div>
    );
};

export default NoticeUpdate;