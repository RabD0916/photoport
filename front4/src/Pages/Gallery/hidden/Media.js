import './HiddenCategory.scss';
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

const Media = ({onChildClick}) => {
    const {cateId} = useParams();
    const [media, setMedia] = useState([]);
    const [selectedMediaNames, setSelectedMediaNames] = useState([]);
    // const [accessToken, setAccessToken] = useState("");
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("id");

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
        const data = selectedMediaNames;
        window.opener.postMessage(data, '*');
    };

    return (
        <>
            <div className={"rowbar"}></div>
            {selectedMediaNames && (
                <div>
                    <h3>Selected Image</h3>
                    {selectedMediaNames.map((mediaName) => (
                        <img src={"/images/" + userId + "/" + cateId + "/" +mediaName} alt="Selected"/>
                    ))}
                    <button onClick={sendDataToParent}>부모 창으로 데이터 전송</button>
                </div>
            )}

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