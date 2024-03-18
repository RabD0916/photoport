import '../Css/InGallery.css';
import '../Css/nav.css';
import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

const InGallery = () => {
    const {userId} = useParams();
    const [cate, setCate] = useState([]);

    useEffect(() => {
        async function getCategoryList() {
            const result = await axios.get(
                `http://localhost:3000/sendCategory/${userId}`
            );
            return result.data;
        }

        getCategoryList().then(r => setCate(r));
    }, [userId]);

    async function createCate(cateName) {
        const result = await axios.post(
            `http://localhost:3000/createCategory/${cateName}`
        )
        return result.data;
    }

    async function deleteCate(cateName) {
        const result = await axios.delete(
            `http://localhost:3000/deleteCategory/${cateName}`
        )
        return result.data;
    }

    async function forceDeleteCate(cateName) {
        const result = await axios.delete(
            `http://localhost:3000/forceDeleteCategory/${cateName}`
        )
        return result.data;
    }

    const createCategory = e => {
        const cateName = prompt("생성할 카테고리 이름을 입력하세요.");
        if(cateName === null) {
            return;
        }
        if(cateName === "") {
            alert("생성할 카테고리의 이름을 입력하지 않았습니다.")
            return;
        }
        createCate(cateName).then((result) => {
            if(result === "Success") {
                alert("카테고리 생성 완료");
                window.location.reload();
            } else if(result === "Already Exist") {
                alert("이미 존재하는 카테고리 이름입니다.");
            } else {
                alert("카테고리 생성 실패");
            }
        });
    }

    const deleteCategory = e => {
        const cateName = prompt("삭제할 카테고리 이름을 입력하세요.");
        if(cateName === null) {
            return;
        }
        if(cateName === "") {
            alert("삭제할 카테고리의 이름을 입력하지 않았습니다.")
            return;
        }
        deleteCate(cateName).then((result) => {
            if(result === "Success") {
                alert("카테고리 삭제 완료");
                window.location.reload();
                return;
            }
            alert("내부에 사진이 있어 삭제하지 못했습니다.");
            if(!window.confirm("내부의 사진까지 삭제하시겠습니까?")) {
                return;
            }
            forceDeleteCate(cateName).then(result => {
                if(result === "Success") {
                    alert("카테고리 삭제 완료");
                    window.location.reload();
                    return;
                }
                alert("카테고리 삭제 실패");
            });
        });
    }

    return (
        <>
            <h1>{userId}의 갤러리</h1>
            <div>
                <a onClick={createCategory} className={"downright"}>카테고리 생성</a>
                <a onClick={deleteCategory} className={"downright"}>카테고리 삭제</a>
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