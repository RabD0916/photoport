import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

const Gallary = () => {
    const { userId } = useParams();
    const [cate, setCate] = useState([]);

    useEffect(() => {
        fetch("/sendCategory/" + userId, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                return res.json();
            })
            .then(function (result) {
                setCate(result);
            })
    },[]);

    return (
        <>
            <h3>{userId}의 갤러리</h3>
            <div>{cate.map((v, idx) => <li key={`${idx}-${v}`}>{v}</li>)}</div>
        </>
    );
}

export default Gallary;