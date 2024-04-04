import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

const First = () => {
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
        getCategoryList().then(r => setCate(r));
    }, [userId]);
    return(
        <div>
            <div className={"cate-list"}>
                {cate.map((cateId) => (
                    <Link key={cateId[0]} to={"/gallery/" + userId + "/" + cateId[0]} className={"cate"}>
                        {cateId[1] !== "Empty" ?
                            <img className={"cate-image"} src={"/images/" + userId + "/" + cateId[0] + "/" + cateId[1]}
                                 alt={cateId[1]}
                            ></img>
                            : <div className={"not_box"}></div>}
                        <div
                            className={"cate-name"}>{decodeURI(decodeURIComponent(cateId[0].replaceAll("&", "%")))}</div>
                    </Link>
                ))}
            </div>
        </div>
    )

}

export default First;