import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

const Gallary = () => {
    const { userId } = useParams();
    const [cate, setCate] = useState([]);

    useEffect(() => {
        fetch("/sendCategory/userId")
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
            <div>${cate.pop()}</div>
        </>
    );
}

export default Gallary;