import React, { useState, useEffect } from "react";
import "./BoardCss/Report.scss"
const Report = ({ selectedPost }) => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReason, setOtherReason] = useState("");
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

        fetch(`${SERVER_IP}/api/blacklist/report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                writerId: selectedPost.writerId,
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
            <button
                type="button"
                className="mt-3 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2"
                onClick={openModal}
            >
                신고하기
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-2xl font-bold mb-4">신고하기</h3>
                        <ul className="space-y-2">
                            <li>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="음란물"
                                        checked={selectedReason === "음란물"}
                                        onChange={handleReasonChange}
                                        className="form-radio text-indigo-600"
                                    />
                                    <span className="ml-2">음란물</span>
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="폭력성"
                                        checked={selectedReason === "폭력성"}
                                        onChange={handleReasonChange}
                                        className="form-radio text-indigo-600"
                                    />
                                    <span className="ml-2">폭력성</span>
                                </label>
                            </li>
                            <li>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        value="기타"
                                        checked={selectedReason === "기타"}
                                        onChange={handleReasonChange}
                                        className="form-radio text-indigo-600"
                                    />
                                    <span className="ml-2">기타</span>
                                </label>
                                {selectedReason === "기타" && (
                                    <input
                                        type="text"
                                        placeholder="기타 이유를 입력하세요"
                                        value={otherReason}
                                        onChange={handleOtherReasonChange}
                                        className="mt-2 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-500"
                                    />
                                )}
                            </li>
                        </ul>
                        <div className="mt-6 flex justify-end space-x-2">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                                onClick={closeModal}
                            >
                                닫기
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
                                onClick={handleSubmit}
                            >
                                신고
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Report;
