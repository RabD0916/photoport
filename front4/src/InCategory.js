import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';

const InCategory = () => {
    const {userId} = useParams();
    const {cateId} = useParams();
    const [media, setMedia] = useState([]);

    useEffect(() => {
        fetch("/sendMedia/" + userId + "/" + cateId)
            .then((res) => {
                return res.json();
            })
            .then(function (result) {
                setMedia(result);
            })
    }, [userId, cateId]);

    return (
        <>
            <h1>{userId}의 갤러리</h1>
            <h3>{cateId} 카테고리</h3>

            <div className={"cate-list"}>{media.map((mediaName, k) => (
                <Link key={k} to={"/gallery/" + userId + "/" + cateId + "/" + mediaName} className={"cate"}>
                    <img src={"/images/" + userId + "/" + cateId + "/" + mediaName} alt={mediaName} width="225" height="225px"></img>
                </Link>
            ))}
            </div>
        </>
    );
}

export default InCategory;