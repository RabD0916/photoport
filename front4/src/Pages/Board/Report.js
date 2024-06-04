import React, { useState, useEffect } from "react";
import "./BoardCss/Report.scss";

const Report = ({ selectedPost }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState(""); // 선택된 이유를 상태로 관리합니다.
    const [otherReason, setOtherReason] = useState(""); // 기타 이유를 입력하는 상태를 추가합니다.
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        console.log("Selected Post:", selectedPost);
    }, [selectedPost]);

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
        if (!selectedPost || !selectedPost.writerId) {
            alert("게시글 작성자가 선택되지 않았습니다.");
            return;
        }

        const reason = selectedReason === "기타" ? otherReason : selectedReason;

        fetch("http://localhost:8080/api/blacklist/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`  // 올바른 인증 헤더를 추가합니다.
            },
            body: JSON.stringify({
                writerId: selectedPost.writerId,  // 작성자의 ID로 변경
                reason: reason,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || "신고 접수에 실패하였습니다.");
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data && data.message) {
                    alert(data.message);
                } else {
                    alert("신고 접수에 실패하였습니다.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert(error.message);
            });

        closeModal();
    };


    return (
        <div className="report">
            {/* 신고하기 버튼 */}
            <button
                type="button"
                className={"justify-items-end mt-3 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center" +
                    " me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"} onClick={openModal}>
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
