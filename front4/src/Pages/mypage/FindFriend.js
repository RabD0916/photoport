import React, {useState, useEffect} from 'react';
import axios from 'axios';

function AddFriendPage() {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const accessToken = localStorage.getItem("accessToken");
    const [email, setEmail] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]); // 받은 친구 요청 목록 관리를 위한 state
    const [profileImages, setProfileImages] = useState({});

    useEffect(() => {
        fetchReceivedRequests(); // 컴포넌트 마운트 시 받은 친구 요청을 불러옵니다.
    }, []);

    const handleSearchChange = (event) => {
        setEmail(event.target.value); // 검색창의 입력값을 관리합니다.
    };

    // 받은 친구 요청을 불러오는 함수
    const fetchReceivedRequests = async () => {
        try {
            const response = await axios.get(`${SERVER_IP}/api/user/friends/received`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setReceivedRequests(response.data.waitingFriendRequests);
            updateProfileImages(response.data);

        } catch (error) {
            console.error("받은 친구 요청을 불러오는 중 오류가 발생했습니다.", error);
        }
    };

    const updateProfileImages = async (boards) => {
        let newImages = {...profileImages};
        for (const list of receivedRequests) {
            if (!newImages[list.writerId]) {
                try {
                    const response = await axios.get(`${SERVER_IP}/api/profile/${list.writerId}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    newImages[list.writerId] = response.data.userProfile;
                } catch (error) {
                    console.error("Failed to load profile image", error);
                }
            }
        }
        setProfileImages(newImages);
    };
    // 사용자 검색 처리 함수
    const handleSearch = async () => {
        try {
            const response = await axios.get(`${SERVER_IP}/api/user/search`, {
                params: {email: email},
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            const results = response.data
            setSearchResults(response.data); // 검색 결과를 업데이트합니다.

            if (results.length === 0) {
                alert("검색 결과가 존재하지 않습니다!");
            }

        } catch (error) {
            alert("검색 결과가 존재하지 않습니다!");
            console.error("검색 중 오류가 발생했습니다.", error);
        }
    };

    // 친구 추가 요청 처리 함수
    const handleAddFriend = async (email) => {
        try {
            await axios.post(`${SERVER_IP}/api/user/friends/${email}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            alert("친구 요청을 보냈습니다!");
            setSearchResults(prevResults => prevResults.filter(user => user.userEmail !== email));
        } catch (error) {
            console.error("친구 추가 중 오류가 발생했습니다.", error);
        }
    };

    // 친구 요청 수락 처리 함수
    const handleApprove = async (friendshipId) => {
        try {
            await axios.post(`${SERVER_IP}/api/user/friends/approve/${friendshipId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            alert("친구 요청을 수락했습니다!");
            fetchReceivedRequests(); // 받은 요청 목록을 업데이트합니다.
        } catch (error) {
            console.error("친구 요청 수락 중 오류가 발생했습니다.", error);
        }
    };

    // 친구 요청 거절 처리 함수
    const handleReject = async (friendshipId) => {
        try {
            await axios.delete(`${SERVER_IP}/api/user/friends/reject/${friendshipId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            alert("친구 요청을 거절했습니다!");
            fetchReceivedRequests(); // 받은 요청 목록을 업데이트합니다.
        } catch (error) {
            console.error("친구 요청 거절 중 오류가 발생했습니다.", error);
        }
    };

    return (
        <div className={"bg-white p-8 rounded-md w-3/5 mx-auto"}>
            <div className={"flex flex-col items-center pb-6"}>
                <div>
                    <h2 className={"text-gray-600 font-semibold"}>친구검색</h2>
                </div>
                <div className={"flex flex-col items-center mt-4"}>
                    <input className={"bg-gray-50 outline-none ml-1 block"}
                           type="text"
                           placeholder="친구 검색..."
                           value={email}
                           onChange={handleSearchChange}
                    />
                    <button className={"mt-2"} onClick={handleSearch}>검색</button>
                </div>
                <div className={"mt-4"}>
                    {searchResults.map((user) => (
                        <div key={user.id} className={"flex items-center mt-2 border-black"}>
                            {user.userId} - {user.userNick}
                            <button className={"ml-4"} onClick={() => handleAddFriend(user.userEmail)}>친구 추가</button>
                        </div>
                    ))}
                </div>
                <div className={"mt-6 w-full"}>
                    받은 친구 요청
                    <div className={"-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto"}>
                        <div className={"inline-block min-w-full shadow rounded-lg overflow-hidden"}>
                            <table className={"min-w-full leading-normal"}>
                                <thead className={"content-center text-center"}>
                                <tr>
                                    <th
                                        className={"px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"}>
                                        아이디
                                    </th>
                                    <th
                                        className={"px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"}>
                                        닉네임
                                    </th>
                                    <th
                                        className={"px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"}>
                                        이메일
                                    </th>
                                    <th
                                        className={"px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"}>
                                        수락여부
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {receivedRequests.map((request) => (
                                    <tr key={request.friendshipId}>
                                        <td className={"px-5 py-5 border-b border-gray-200 bg-white text-sm"}>
                                            {request.friendshipId}
                                        </td>
                                        <td className={"px-5 py-5 border-b border-gray-200 bg-white text-sm"}>
                                            {request.friendName}
                                        </td>
                                        <td className={"px-5 py-5 border-b border-gray-200 bg-white text-sm"}>
                                            {request.friendEmail}
                                        </td>
                                        <td className={"px-5 py-5 border-b border-gray-200 bg-white text-sm"}>
                                            <button
                                                className={"bg-blue-500 text-white px-4 py-2 rounded mr-2"}
                                                onClick={() => handleApprove(request.friendshipId)}>
                                                수락
                                            </button>
                                            <button
                                                className={"bg-red-500 text-white px-4 py-2 rounded"}
                                                onClick={() => handleReject(request.friendshipId)}>
                                                거절
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AddFriendPage;

