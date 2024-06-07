import {Link, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

const InGallery = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    //const {userId} = useParams();
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem('id');
    const [cate, setCate] = useState([]);


    useEffect(() => {
        console.log(userId);
        console.log(accessToken);
        async function getCategoryList() {
            const result = await axios.get(
                `${SERVER_IP}/api/sendCategory/${userId}`,
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

    async function createCate(cateName) {
        const result = await axios.post(
            `${SERVER_IP}/api/createCategory/${cateName}`,
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
            `${SERVER_IP}/api/deleteCategory/${cateName}`,
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
        const result = await axios.patch(
            `${SERVER_IP}/api/RenameCategory/${cateName}`
        )
        return result.data;
    }

    async function forceDeleteCate(cateName) {
        const result = await axios.delete(
            `${SERVER_IP}/api/forceDeleteCategory/${cateName}`,
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
        <section className={"text-gray-600 body-font"}>
            <div className={"container mx-auto p-5 py-24"}>
                <div className={"flex flex-col text-center w-full mb-20"}>
                    <h1 className={"sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900"}>{userId}님의 추억</h1>
                    <p className={"lg:w-2/3 mx-auto leading-relaxed text-base"}>Categories</p>
                </div>
                <div className="flex justify-center space-x-4 my-4">
                    <button onClick={createCategory}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">앨범 추가
                    </button>
                    <button onClick={deleteCategory}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">앨범 삭제
                    </button>
                    <button onClick={renameCategory}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">앨범 수정
                    </button>
                </div>

                <div className="flex flex-wrap justify-center -m-4">
                    {cate.map((category) => (
                        <div key={category["name"]} className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                            <Link to={"/gallery/" + userId + "/" + category["name"]}
                                  className={"block relative h-48 rounded overflow-hidden group"}>
                                {category["thumbnail"] !== "Empty" ? (
                                    <img
                                        className={"absolute inset-0 w-full h-full object-cover object-center opacity-100 group-hover:opacity-100 transition duration-300 ease-in-out"}
                                        src={"/images/" + userId + "/" + category["name"] + "/" + category["thumbnail"]}
                                        alt={category["thumbnail"]}
                                    />
                                ) : (
                                    <div
                                        className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200">
                                        <span
                                            className="text-gray-500 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">NO IMAGE</span>
                                    </div>
                                )}
                                <div
                                    className={"px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-100 group-hover:opacity-0 transition duration-300 ease-in-out"}>
                                    <div
                                        className={"tracking-widest text-2xl title-font font-medium text-black mb-1"}>{decodeURI(decodeURIComponent(category["name"].replaceAll("&", "%")))}</div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    

    );
}

export default InGallery;
