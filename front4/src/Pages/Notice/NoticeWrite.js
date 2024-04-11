import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NoticeWrite = () => {
    const navigate = useNavigate();
    const fileInput = React.useRef(null);

    const [NoticeShow, setNotice] = useState({
        title: '',  //제목
        createdBy: '', // 관리자 계정 아이디 저장할 예정
        contents: '', // 그냥 내용
        file: null, // 파일 정보 저장
        fileUrl: '', // 파일 URL 주소 저장
        filePreviewUrl: '' // 파일 미리보기 URL 주소 저장
    });

    const { title, createdBy, contents, file, fileUrl, filePreviewUrl } = NoticeShow;
    /*createdAt 추가 필요*/
    /*createdBy 로그인 관리자계정 아이디 확인 필요*/
    /*fileUrl 추가 필요*/

    const onChange = (event) => {
        const { value, name } = event.target;
        setNotice({
            ...NoticeShow,
            [name]: value,
        });
    };

    const saveNotice = async () => {
        try {
            /*axios url 수정 필요*/
            await axios.post('http://localhost:8080/Notice', NoticeShow);
            alert('등록완료');
            navigate('/Notice');
        } catch (error) {
            console.error('공지사항 저장 실패:', error);
        }
    };

    const backToList = () => {
        navigate('/Notice');
    };

    const handleButtonClick = () => {
        fileInput.current.click();
    };

    const handleDeleteImage = () => {
        setNotice({
            ...NoticeShow,
            file: null,
            fileUrl: '',
            filePreviewUrl: ''
        });
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileUrl = URL.createObjectURL(selectedFile); // 파일의 URL 생성
            setNotice({
                ...NoticeShow,
                file: selectedFile,
                fileUrl: fileUrl, // 파일 URL 주소 저장
                filePreviewUrl: window.URL.createObjectURL(selectedFile) // 파일 미리보기 URL 저장
            });
        }
    };

    return (
        <div>
            <div className='container'>
                <div>
                    <span>제목</span>
                    <input id='title_input' type="text" name="title" value={title} onChange={onChange} placeholder='제목입력'/>
                </div>
                <br/>
                <div>
                    <span>내용</span><br/>
                    <textarea id='contents_area'
                              name="contents"
                              cols="30"
                              rows="10"
                              value={contents}
                              onChange={onChange}
                              placeholder='내용을 입력해주세요'
                    ></textarea>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInput}
                        onChange={handleChange}
                        style={{display: 'none'}}
                    />
                </div>

                <div>


                    {filePreviewUrl && <img src={filePreviewUrl} alt="파일 미리보기"
                                            style={{width: '300px', height: 'auto'}}/>} {/* 파일 미리보기, 크기 고정 */}

                </div>
            </div>

            <br/>
            이미지 첨부 :
            {file && (
                <div>
                    <span>파일명: {file.name}</span>
                    {/* <span>이미지 주소: {fileUrl}</span> */}
                    <button id='del_img_btn' onClick={handleDeleteImage}>삭제</button>
                    {/* 이미지 삭제 버튼 */}

                </div>
            )}
            <button id='add_img_btn' onClick={handleButtonClick}>찾아보기</button>

            <br/>
            <div>
                <button id='cancle_save_btn' onClick={saveNotice}>저장</button>
                <button id='cancle_save_btn' onClick={backToList}>취소</button>
            </div>
        </div>
    );
};

export default NoticeWrite;
