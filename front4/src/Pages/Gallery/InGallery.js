import './InGallery.css';
import '../../Component/nav.scss';
import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

const InGallery = () => {
    //const {userId} = useParams();
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('username');
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

    async function createCate(cateName) {
        const result = await axios.post(
            `http://localhost:8080/api/createCategory/${cateName}`,
        {},
            {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type' : 'application/json'
                },
            }
        );
        return result.data;
    }

    async function deleteCate(cateName) {
        const result = await axios.delete(
            `http://localhost:8080/api/deleteCategory/${cateName}`,
            {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type' : 'application/json'
                }
            }
        )
        return result.data;
    }
    async function RenameCate(cateName) {
        const result = await axios.Rename(
            `http://localhost:8080/api/RenameCategory/${cateName}`
        )
        return result.data;
    }

    async function forceDeleteCate(cateName) {
        const result = await axios.delete(
            `http://localhost:8080/api/forceDeleteCategory/${cateName}`,
            {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type' : 'application/json'
                }
            }
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
    const renameCategory = () => {
        const newCateName = prompt("수정할 카테고리 이름을 입력하세요.");
        if(newCateName === null) {
            return;
        }
        if(newCateName === "") {
            alert("수정할 카테고리의 이름을 입력하지 않았습니다.");
            return;
        }
        const cateName = prompt("새로운 카테고리 이름을 입력하세요.", newCateName);
        if(cateName === null) {
            return;
        }
        if(cateName === "") {
            alert("카테고리의 이름을 입력하지 않았습니다.");
            return;
        }
        RenameCate(cateName).then((result) => {
            if(result === "Success") {
                alert("카테고리 수정 완료");
                window.location.reload();
            } else if(result === "Already Exist") {
                alert("이미 존재하는 카테고리 이름입니다.");
            } else {
                alert("카테고리 수정 실패");
            }
        });
    }

    return (
        <div className={"gal_main"}>
            <div className={"five"}>
                <h1>{userId}님의 추억
                    <span>Categories</span>
                </h1>
            </div>
            <div className={"galnav"}>
                <button onClick={createCategory} className={"CreCate"}>앨범 추가</button>
                <button onClick={deleteCategory} className={"DelCate"}>앨범 삭제</button>
                <button onClick={renameCategory} className={"ReCate"}>앨범 수정</button>
            </div>
            <div className={"rowbar"}/>

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
    );
}

export default InGallery;