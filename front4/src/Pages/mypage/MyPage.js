import React, {useEffect, useState} from "react";
// import { useNavigate } from "react-router-dom"; // React Router의 useNavigate 임포트
import "./css/MyPage.scss";
import {MAIN_DATA} from "./MainData";
import First from "./Number/First";
import Second from "./Number/Second";
import styled from "styled-components";
function MyPage() {
    // const [imagePreview, setImagePreview] = useState(null);
    // // const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 가져오기
    const [content, setContent] = useState();
    // 파일 입력 요소의 값이 변경되면 호출되는 함수
    const [userId, setUserId] = useState('');
    // 로그인 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // 선택한 파일을 읽어서 미리보기로 사용할 수 있도록 설정
            const reader = new FileReader();
            reader.onloadend = () => {
                // setImagePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    useEffect(() => {
        // 로그인 상태 확인
        const token = localStorage.getItem("accessToken");
        const storedUsername = localStorage.getItem("id");
        if (token) {
            setIsLoggedIn(true);
            if (storedUsername) {
                setUserId(storedUsername);
            }
        }
    });

    // 파일 업로드 버튼 클릭 시 파일 입력 요소 클릭 이벤트 발생
    const handleButtonClick = () => {
        fileInput.current.click();
    };

    // 파일 입력 요소에 대한 ref 생성
    const fileInput = React.useRef(null);

    const handleClickButton = e => {
        const { name } = e.target;
        setContent(name);
    };
    const selectComponent = {
        first: <First />,
        second: <Second />,
    };

    return (
        <>
            <div className={"main-mypage"}>
                <div className={"myprofile"}>
                        <div className={"pro-image"}>
                            {/*<img src="#" alt={""} />*/}
                            <button onClick={handleButtonClick} className={"img_btn"}>사진 삽입</button>
                        </div>
                    {/*)}*/}
                    <input type={"file"} onChange={handleChange} ref={fileInput} style={{ display: "none" }} />
                    <div className={"input_container"}>
                    <h2>{userId}</h2>
                    <button>수정</button>
                    </div>
                    <button className={"follow"}>팔로우</button>
                    <div className={"my-pageNav"}>
                        <Container>
                            {MAIN_DATA.map(data => {
                                return (
                                    <Button onClick={handleClickButton} name={data.name} key={data.id}>
                                        {data.text}
                                    </Button>
                                );
                            })}
                        </Container>
                        {content && <Content>{selectComponent[content]}</Content>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyPage;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20vh;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  margin-right: 1rem;
  color: #111111;
  background-color: #eeeeee;
  border-radius: 2rem;
`;

const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;
