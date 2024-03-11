import './InGallery.css';
import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

const InGallery = () => {
    const {userId} = useParams();
    const [cate, setCate] = useState([]);

    useEffect(() => {
        let isCompleted = false;

        async function get() {
            const result = await axios.get(
                `http://localhost:3000/sendCategory/${userId}`
            );
            if (!isCompleted) {
                setCate(result.data);
            }
        }

        get();
        return () => {
            isCompleted = true;
        }
        // fetch("/sendCategory/" + userId)
        //     .then((res) => {
        //         return res.json();
        //     })
        //     .then(function (result) {
        //         if(result[0] === "Folder Not Found") {
        //             alert("해당 유저가 존재하지 않습니다.");
        //             window.history.back();
        //             return;
        //         }
        //         setCate(result);
        //     })
    }, [userId]);

    const createCategory = e => {

    }

    return (
        <>
            <h1>{userId}의 갤러리</h1>
            <div>
                <Link to={"rightLinks"} onClick={createCategory} className={"downright"}>카테고리 생성</Link>
            </div>
            <div className={"cate-list"}>{cate.map((cateId) => (
                <Link key={cateId[0]} to={"/gallery/" + userId + "/" + cateId[0]} className={"cate"}>
                    {cateId[1] !== "Empty" ?
                        <img src={"/images/" + userId + "/" + cateId[0] + "/" + cateId[1]} alt={cateId[1]} width="225"
                             height="225px"></img>
                        : null}
                    <div>{cateId[0]}</div>
                </Link>
            ))}
            </div>
        </>
    );
}

export default InGallery;