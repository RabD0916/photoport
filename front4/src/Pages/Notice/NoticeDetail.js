import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NoticeShow from './NoticeShow';

const NoticeDetail =()=> {
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [notice, setNotice] = useState({});
    const getNotice = async () => {
        /*axios url 주소 수정 필요함*/
        try{ const resp = await (await axios.get(`http://localhost:8080/Notice/${id}`)).data;
            setNotice(resp.data);
            setLoading(false);}
        catch(error){
            console.error('공지사항 불러오기 실패 : ', error);
        }
    };
    useEffect(() => {
        getNotice();
    }, []);
    return (
        <div>
            {loading ? (
                <h2>loading...</h2>
            ) : (
                <NoticeShow
                    idx={NoticeShow.id}
                    title={NoticeShow.title}
                    contents={NoticeShow.contents}
                    createdBy={NoticeShow.createdBy}
                    /*createdAt*/
                    fileUrl={NoticeShow.fileUrl}
                />
            )}
        </div>
    );
};

export default NoticeDetail;
