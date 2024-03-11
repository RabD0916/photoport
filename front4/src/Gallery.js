import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
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

const Gallery = () => {
    const {userId} = useParams();
    const [cate, setCate] = useState([]);

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    useEffect(() => {
        fetch("/sendCategory/" + userId)
            .then((res) => {
                return res.json();
            })
            .then(function (result) {
                if(result[0] === "Folder Not Found") {
                    alert("해당 유저가 존재하지 않습니다.");
                    window.history.back();
                    return;
                }
                setCate(result);
            })
    }, [userId]);

    return (
        <>
            <GalleryContainer>
                {cate.map((v, index) => (
                    <img
                        key={index}
                        src={`/images/${userId}/${v}`} // 이미지 파일 경로 생성
                        alt={v} // 이미지 파일 이름을 alt 속성으로 사용
                        onClick={() => handleImageClick(`/images/${userId}/${v}`)}
                    />
                ))}
            </GalleryContainer>
            {selectedImage && (
                <div>
                    <h3>Selected Image</h3>
                    <img src={selectedImage} alt="Selected" />
                </div>
            )}

            <h3>{userId}의 갤러리</h3>
            <div>{cate.map((v) => <img src={"/images/" + userId + "/" + v} alt={v}></img>)}</div>
            <div>
                갤러리 페이지
            </div>
        </>
    );
}

export default Gallery;