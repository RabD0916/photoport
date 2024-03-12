import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import styled from 'styled-components';


const GalleryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin: 10px;
  cursor: pointer;
`;

const InCategory = () => {
    const {userId} = useParams();
    const {cateId} = useParams();
    const [media, setMedia] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetch("/sendMedia/" + userId + "/" + cateId)
            .then((res) => {
                return res.json();
            })
            .then(function (result) {
                setMedia(result);
            })
    }, [userId, cateId]);

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    return (
        <>
            <h1>{userId}의 갤러리</h1>
            <h3>{cateId} 카테고리</h3>

            {selectedImage && (
                <div>
                    <h3>Selected Image</h3>
                    <img src={selectedImage} alt="Selected" />
                </div>
            )}

            <GalleryContainer>
                <div className={"cate-list"}>{media.map((mediaName, index) => (
                    //<Link key={index} to={"/gallery/" + userId + "/" + cateId + "/" + mediaName} className={"cate"}>
                        <img src={"/images/" + userId + "/" + cateId + "/" + mediaName}
                            alt={mediaName}
                            width="225"
                            height="225px"
                            onClick={() => handleImageClick(`/images/${userId}/${cateId}/${mediaName}`)}
                        ></img>
                    //</Link>
                ))}
                </div>
            </GalleryContainer>

        </>
    );
}

export default InCategory;