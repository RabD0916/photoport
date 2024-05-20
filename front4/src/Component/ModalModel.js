import React, { useState } from "react";
// import "./BoardCss/Report.scss";

const ModalModel = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleSubmit = () => {
       //여기서 여러가지 행위에 대한을 전달
        // 모달을 닫습니다.
        closeModal();
    };

    return (
        <div className="report">
            {/* 신고하기 버튼 */}
            <button type="button" className="Modalopen" onClick={openModal}>
                모달 창 열기
            </button>

            {/* 모달 창 */}
            <div className={`modal ${isModalOpen ? 'on' : ''}`}>
                <div className="modal_popup">
                    갤러리
                    <button type="button" className="submit_btn" onClick={handleSubmit}>데이터 보내기</button>
                    <button type="button" className="close_btn" onClick={closeModal}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default ModalModel;