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
        <div className="bg-pink-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-md w-3/5 shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-gray-800 text-2xl font-bold">친구 검색</h2>
                </div>
                <div className="flex flex-col items-center">
                    <input
                        className="bg-gray-50 outline-none p-2 rounded w-64 shadow-sm"
                        type="text"
                        placeholder="친구 검색..."
                        value={email}
                        onChange={handleSearchChange}
                    />
                    <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition-colors duration-200"
                        onClick={handleSearch}
                    >
                        검색
                    </button>
                </div>
                <div className="mt-8 w-full">
                    <div className="text-lg font-semibold mb-4">검색 결과</div>
                    <div className="bg-gray-100 p-4 rounded shadow-sm">
                        {searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <div key={user.id}
                                     className="flex items-center justify-between p-2 border-b border-gray-300">
                                    <div>
                                        <span className="font-medium">{user.userId}</span> - {user.userNick}
                                    </div>
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600 transition-colors duration-200"
                                        onClick={() => handleAddFriend(user.userEmail)}
                                    >
                                        친구 추가
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-600">검색 결과가 없습니다.</div>
                        )}
                    </div>
                </div>
                <div className="mt-8 w-full">
                    <div className="text-lg font-semibold mb-4">받은 친구 요청</div>
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">아이디</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">닉네임</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">이메일</th>
                                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">수락여부</th>
                                </tr>
                                </thead>
                                <tbody>
                                {receivedRequests.length > 0 ? (
                                    receivedRequests.map((request) => (
                                        <tr key={request.friendshipId}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{request.friendshipId}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{request.friendName}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{request.friendEmail}</td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex justify-between">
                                                <button
                                                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition-colors duration-200 mr-2"
                                                    onClick={() => handleApprove(request.friendshipId)}
                                                >
                                                    수락
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition-colors duration-200"
                                                    onClick={() => handleReject(request.friendshipId)}
                                                >
                                                    거절
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4"
                                            className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-600">받은
                                            친구 요청이 없습니다.
                                        </td>
                                    </tr>
                                )}
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
