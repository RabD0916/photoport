import '../Css/InCategory.css';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import axios from "axios";


const GalleryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

// const Image = styled.img`
//   width: 200px;
//   height: 200px;
//   object-fit: cover;
//   margin: 10px;
//   cursor: pointer;
// `;

const InCategory = () => {
    const {userId} = useParams();
    const {cateId} = useParams();
    const [media, setMedia] = useState([]);
    const [selectedMediaNames, setSelectedMediaNames] = useState([]);

    useEffect(() => {
        async function getMediaList() {
            const result = await axios.get(
                `http://localhost:3000/sendMedia/${cateId}`
            );
            return result.data;
        }
        getMediaList().then(r => setMedia(r));
    }, [cateId]);

    async function moveM(mediaNames, nextCateName) {
        const result = await axios.patch(
            `http://localhost:3000/moveMedia/${mediaNames}/${nextCateName}`
        )
        return result.data;
    }

    async function deleteM(mediaNames) {
        if(selectedMediaNames.length < 1) {
            alert("사진을 선택하지 않으셨습니다.");
        }

        const result = await axios.delete(
            `http://localhost:3000/deleteMedia/${mediaNames}`
        )
        return result.data;
    }

    const moveMedia = e => {
        if(selectedMediaNames.length < 1) {
            alert("사진을 선택하지 않으셨습니다.");
            return;
        }

        const nextMediaName = prompt("이동할 카테고리 이름을 적으세요.");
        if(nextMediaName === null) {
            return;
        } else if(nextMediaName === "") {
            alert("이동할 카테고리의 이름을 입력하지 않았습니다.")
            return;
        } else if(nextMediaName === cateId) {
            alert("현재 카테고리의 이름을 적으셨습니다.")
            return;
        }

        const mediaNameString = selectedMediaNames.join(",");
        moveM(mediaNameString, nextMediaName).then(r => {
            switch (r) {
                case "Success": alert("미디어 이동 완료"); window.location.reload(); break;
                case "Fail":    alert("미디어 이동 실패"); break;
                case "Not Exist": alert("일부 미디어가 존재하지 않습니다."); break;
                default: alert("미디어 이동 오류");
            }
        })
    }

    const deleteMedia = e => {
        if(window.confirm("정말로 삭제하시겠습니까?")) {
            const mediaNameString = selectedMediaNames.join(",");
            deleteM(mediaNameString).then(r => console.log(r));
            window.location.reload();
        }
    }

    const handleImageClick = (newMediaName) => {
        if(selectedMediaNames.some((mediaName) => mediaName === newMediaName)) {
            setSelectedMediaNames(selectedMediaNames.filter(media => media !== newMediaName));  // delete
        } else {
            setSelectedMediaNames([...selectedMediaNames, newMediaName])              // add
        }
    };

    return (
        <>
            <div className={"five"}>
                <h1>{userId}님의 추억
                    <span>{decodeURI(decodeURIComponent(cateId.replaceAll("&", "%")))}</span>
                </h1>
            </div>
            <div className={"incate-nav"}>
                <button onClick={moveMedia} className={"MoveMedia"}>미디어 이동</button>
                <button onClick={deleteMedia} className={"DelMedia"}>미디어 삭제</button>
            </div>
            <div className={"rowbar"}></div>

            {selectedMediaNames && (
                <div>
                    <h3>Selected Image</h3>
                    {selectedMediaNames.map((mediaName) => (
                        <img src={mediaName} alt="Selected"/>
                    ))}
                </div>
            )}

            <GalleryContainer className={"Media-list"}>
                <div className={"cate-list"}>{media.map((mediaName) => (
                    //<Link key={index} to={"/gallery/" + userId + "/" + cateId + "/" + mediaName} className={"cate"}>
                    <img src={"/images/" + userId + "/" + cateId + "/" + mediaName}
                         alt={mediaName} className={"incate-image"}
                         onClick={() => handleImageClick(mediaName)}
                    ></img>
                    //</Link>
                ))}
                </div>
            </GalleryContainer>

        </>
    );
}

export default InCategory;