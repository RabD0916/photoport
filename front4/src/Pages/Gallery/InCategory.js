import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';
import axios from "axios";


const GalleryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const InCategory = (props) => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const {cateId} = useParams();
    const [media, setMedia] = useState([]);
    const [selectedMediaNames, setSelectedMediaNames] = useState([]);
    // const [accessToken, setAccessToken] = useState("");
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("id");
    // const settings = {
    //     dots: true,
    //     fade: false,
    //     arrows : false, 		// 옆으로 이동하는 화살표 표시 여부
    //     infinite: true,
    //     draggable : true, 	//드래그 가능 여부
    //     speed: 500,
    //     slidesToScroll: 1,
    //     responsive: [ // 반응형 웹 구현 옵션
    //         {
    //             breakpoint: 960, //화면 사이즈 960px일 때
    //             settings: {
    //                 //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
    //                 slidesToShow:3
    //             }
    //         },
    //         {
    //             breakpoint: 600, //화면 사이즈 768px일 때
    //             settings: {
    //                 //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
    //                 slidesToShow:2,
    //                 fade: true
    //             }
    //         }
    //     ]
    // };
    useEffect(() => {
        // setAccessToken(localStorage.getItem("accessToken"));
        async function getMediaList() {
            const result = await axios.get(
                `${SERVER_IP}/api/sendMedia/${cateId}`,
                {
                    headers : {
                        Authorization : `Bearer ${accessToken}`
                    }
                }
            );
            return result.data;
        }
        getMediaList().then(r => setMedia(r));
    }, [cateId]);

    async function createM(mediaNames) {
        const result = await axios.post(
            `${SERVER_IP}/api/createMedia`,
            {mediaNames: mediaNames},
            {
                headers : {
                    Authorization : `Bearer ${accessToken}`
                }
            }
        )
        return result.data;
    }

    async function moveM(mediaNames, nextCateName) {
        const result = await axios.patch(
            `${SERVER_IP}/api/moveMedia/${mediaNames}/${nextCateName}`,
            {},
            {
                headers : {
                    Authorization : `Bearer ${accessToken}`
                }
            }
        )
        return result.data;
    }

    async function deleteM(mediaNames) {
        if(selectedMediaNames.length < 1) {
            alert("사진을 선택하지 않으셨습니다.");
        }

        const result = await axios.delete(
            `${SERVER_IP}/api/deleteMedia/${mediaNames}`,
            {
                headers : {
                    Authorization : `Bearer ${accessToken}`
                }
            }
        )
        return result.data;
    }

    const createMedia =e => {
        if(selectedMediaNames.length < 1) {
            alert("사진을 선택하지 않으셨습니다.");
            return;
        }
        const mediaNameString = selectedMediaNames.join(",");
        createM(selectedMediaNames, cateId).then(r => {
            if (r === "Success") {
                console.log(selectedMediaNames);
                alert("미디어 생성 완료");
                // 여기서 적절한 React 상태 업데이트를 수행할 수 있음
            } else {
                alert("미디어 생성 오류");
            }
        });
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
        <section className={"text-gray-600 body-font"}>
            <div className={"container mx-auto p-5 py-24"}>
                <div className={"flex flex-col text-center w-full mb-20"}>
                    <h1 className={"sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900"}>{userId}님의 추억</h1>
                    <p className={"lg:w-2/3 mx-auto leading-relaxed text-base"}>{decodeURI(decodeURIComponent(cateId.replaceAll("&", "%")))}</p>
                </div>
            <div className={"flex flex-col text-center w-full mb-20"}>
                <button onClick={createMedia} className={"lg:w-2/3 mx-auto leading-relaxed text-base"}>미디어 생성</button>
                <button onClick={moveMedia} className={"lg:w-2/3 mx-auto leading-relaxed text-base"}>미디어 이동</button>
                <button onClick={deleteMedia} className={"lg:w-2/3 mx-auto leading-relaxed text-base"}>미디어 삭제</button>
            </div>
                <h1> 선택된 사진</h1>
                <div className={"grid grid-cols-4 gap-4 place-content-center"}>
                        {selectedMediaNames && (
                            selectedMediaNames.map((mediaName, index) => (
                                <img
                                    key={index}
                                    className={"h-auto max-w-full rounded-lg"} src={"/images/" + userId + "/" + cateId + "/" + mediaName}
                                    alt="Selected"
                                    onClick={() => handleImageClick(mediaName)}/>
                            ))
                        )}
                </div>
                <hr className="my-8 border-t-2 border-gray-300" />
                <GalleryContainer className={"grid grid-cols-4 gap-4 place-content-center mt-10"}>
                    {media.map((media, index) => (
                        <img
                            key={index}
                            src={"/images/" + userId + "/" + cateId + "/" + media["mediaName"]}
                            alt={media["mediaName"]} className={"w-1/4 h-auto rounded-lg"}
                            onClick={() => handleImageClick(media["mediaName"])}
                        ></img>
                    ))}
                </GalleryContainer>

            </div>
        </section>
    );
}

export default InCategory;