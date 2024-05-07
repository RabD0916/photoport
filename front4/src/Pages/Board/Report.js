import React, { useState } from "react";
import "./BoardCss/Report.scss";

const Report = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState(""); // 선택된 이유를 상태로 관리합니다.
    const [otherReason, setOtherReason] = useState(""); // 기타 이유를 입력하는 상태를 추가합니다.

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleReasonChange = (event) => {
        setSelectedReason(event.target.value);
    };

    const handleOtherReasonChange = (event) => {
        setOtherReason(event.target.value);
    };

    const handleSubmit = () => {
        // 여기서 선택된 이유와 기타 이유를 처리할 수 있습니다.
        // 예를 들어, 서버에 전송하거나 다른 작업을 수행할 수 있습니다.
        console.log("선택된 이유:", selectedReason);
        console.log("기타 이유:", otherReason);
        // 모달을 닫습니다.
        closeModal();
    };

    return (
        <div className="report">
            {/* 신고하기 버튼 */}
            <button type="button" className="report_btn" onClick={openModal}>
                신고하기
            </button>

            {/* 모달 창 */}
            <div className={`modal ${isModalOpen ? 'on' : ''}`}>
                <div className="report_popup">
                    <h3>신고하기</h3>
                    <ul>
                        <li>
                            <label>
                                <input
                                    type="radio"
                                    value="음란물"
                                    checked={selectedReason === "음란물"}
                                    onChange={handleReasonChange}
                                />
                                음란물
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type="radio"
                                    value="폭력성"
                                    checked={selectedReason === "폭력성"}
                                    onChange={handleReasonChange}
                                />
                                폭력성
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    type="radio"
                                    value="기타"
                                    checked={selectedReason === "기타"}
                                    onChange={handleReasonChange}
                                />
                                기타
                            </label>
                            {/* 기타 항목에 대한 입력 칸 */}
                            {selectedReason === "기타" && (
                                <input
                                    type="text"
                                    placeholder="기타 이유를 입력하세요"
                                    value={otherReason}
                                    onChange={handleOtherReasonChange}
                                />
                            )}
                        </li>
                    </ul>
                    <button type="button" className="submit_btn" onClick={handleSubmit}>신고</button>
                    <button type="button" className="close_btn" onClick={closeModal}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default Report;