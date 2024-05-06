import './HiddenCategory.scss';
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
const Media = ({onChildClick}) => {
    const {cateId} = useParams();
    const [media, setMedia] = useState([]);
    const [selectedMediaNames, setSelectedMediaNames] = useState([]);
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("id");
    const settings = {
        dots: true,
        fade: true,
        arrows : false, 		// 옆으로 이동하는 화살표 표시 여부
        infinite: true,
        draggable : true, 	//드래그 가능 여부
        speed: 100,
        slidesToShow: 1,
        slidesToScroll: 1,
        responsive: [ // 반응형 웹 구현 옵션
            {
                breakpoint: 960, //화면 사이즈 960px일 때
                settings: {
                    //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
                    slidesToShow:3
                }
            },
            {
                breakpoint: 768, //화면 사이즈 768px일 때
                settings: {
                    //위에 옵션이 디폴트 , 여기에 추가하면 그걸로 변경
                    slidesToShow:2
                }
            }
        ]
    };
    useEffect(() => {
        // setAccessToken(localStorage.getItem("accessToken"));
        async function getMediaList() {
            const result = await axios.get(
                `http://localhost:8080/api/sendMedia/${cateId}`,
                {
                    headers : {
                        Authorization : `Bearer ${accessToken}`
                    }
                }
            );
            return result.data;
        }
        getMediaList().then(r => setMedia(r));
    },[cateId]);

    const handleImageClick = (newMediaName) => {
        if(selectedMediaNames.some((mediaName) => mediaName === newMediaName)) {
            setSelectedMediaNames(selectedMediaNames.filter(media => media !== newMediaName));  // delete
        } else {
            setSelectedMediaNames([...selectedMediaNames, newMediaName])              // add
        }
    };
    const sendDataToParent = () => {
        const data = [cateId, selectedMediaNames];
        window.opener.postMessage(data, '*');
    };
    return (
        <>
            <div className={"rowbar"}></div>
            <div className={"slider_center"}>
                <div>
                    <Slider {...settings}>
                        {selectedMediaNames && (
                            selectedMediaNames.map((mediaName) => (
                                <img className={"select_img"} src={"/images/" + userId + "/" + cateId + "/" + mediaName} alt="Selected" />
                            ))
                        )}
                    </Slider>
                </div>
            </div>
            <button onClick={sendDataToParent}>부모 창으로 데이터 전송</button>

            <GalleryContainer className={"Media-list"}>
                <div className={"cate-list"}>{media.map((media) => (
                    <img src={"/images/" + userId + "/" + cateId + "/" + media["name"]}
                         alt={media["name"]} className={"incate-image"}
                         onClick={() => handleImageClick(media["name"])}
                    ></img>
                ))}
                </div>
            </GalleryContainer>

        </>
    );
}

export default Media;