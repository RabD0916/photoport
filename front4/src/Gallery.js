import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

const Gallery = () => {
    const {userId} = useParams();
    const [cate, setCate] = useState([]);

    useEffect(() => {
        fetch("/sendCategory/" + userId)
            .then((res) => {
                return res.json();
            })
            .then(function (result) {
                if(result[0] === "Folder Not Found") {
                    alert("해당 유저가 존재하지 않습니다.");
                    window.history.back();
                    return;
                }
                setCate(result);
            })
    }, [userId]);

    return (
        <>
            <h3>{userId}의 갤러리</h3>
            <div>{cate.map((v) => <img src={"/images/" + userId + "/" + v} alt={v}></img>)}</div>
        </>
    );
}

export default Gallery;