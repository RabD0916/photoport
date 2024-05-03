import './HiddenGallery.scss';
import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

const Gallery = () => {
    //const {userId} = useParams();
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const [cate, setCate] = useState([]);


    useEffect(() => {
        console.log(userId);
        console.log(accessToken);
        async function getCategoryList() {
            const result = await axios.get(
                `http://localhost:8080/api/sendCategory/${userId}`,
                {
                    headers : {
                        Authorization : `Bearer ${accessToken}`
                    }
                }
            );
            return result.data;
        }
        getCategoryList().then(r => {
            // r.map(category => cate.push(category))
            setCate(r);
            console.log(r)
            console.log(cate)
        });
    }, [userId]);
    return (
        <div className={"gal_main"}>
            <div className={"rowbar"}/>
            <div className={"cate-list"}>
                {cate.map((category) => (
                    <Link key={category["name"]} to={"/gallery/hidden/" + userId + "/" + category["name"]} className={"cate"}>
                        {category["thumbnail"] !== "Empty" ?
                            <img className={"cate-image"} src={"/images/" + userId + "/" + category["name"] + "/" + category["thumbnail"]}
                                 alt={category["thumbnail"]}
                            ></img>
                            : <div className={"not_box"}></div>}
                        <div
                            className={"cate-name"}>{decodeURI(decodeURIComponent(category["name"].replaceAll("&", "%")))}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Gallery;