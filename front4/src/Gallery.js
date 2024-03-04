import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

const Gallery = () => {
    const {userId} = useParams();
    const [cate, setCate] = useState([]);

    useEffect(() => {
        fetch("/sendCategory/" + userId)
            .then((res) => {
                if (res == null) {
                    alert("존재하지 않는 유저");
                }
                return res.json();
            })
            .then(function (result) {
                setCate(result);
            })
    }, []);

    return (
        <>
            <h3>{userId}의 갤러리</h3>
            <div>{cate.map((v) => <img src={"/images/" + userId + "/" + v} alt={"null"}></img>)}</div>
        </>
    );
}

export default Gallery;