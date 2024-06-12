import React, { useState, useEffect } from "react";
import axios from "axios";

const Second = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const [friendsList, setFriendsList] = useState([]);
    const [closeFriendsList, setCloseFriendsList] = useState([]);
    const [blockedFriendsList, setBlockedFriendsList] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const [activeList, setActiveList] = useState("friends"); // "friends", "closeFriends", "blockedFriends"
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("id");

    const fetchFriendsList = async () => {
        try {
            const response = await axios.get(`${SERVER_IP}/api/user/friendsList`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setFriendsList(response.data);
            getProfileImages(response.data);
        } catch (error) {
            console.error('친구 목록을 가져오는데 실패했습니다', error);
        }
    };

    const fetchCloseFriendsList = async () => {
        try {
            const response = await axios.get(`${SERVER_IP}/api/close-friends/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setCloseFriendsList(response.data);
            getProfileImages(response.data);
        } catch (error) {
            console.error('친한 친구 목록을 가져오는데 실패했습니다', error);
        }
    };

    const fetchBlockedFriendsList = async () => {
        try {
            const response = await axios.get(`${SERVER_IP}/api/blocked/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setBlockedFriendsList(response.data);
            getProfileImages(response.data);
        } catch (error) {
            console.error('차단 친구 목록을 가져오는데 실패했습니다', error);
        }
    };

    const getProfileImages = async (friends) => {
        const images = {};
        for (const friend of friends) {
            try {
                const response = await axios.get(`${SERVER_IP}/api/profile/${friend.friendName}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                images[friend.friendId] = response.data.userProfile;
            } catch (error) {
                console.error('프로필 이미지를 가져오는데 실패했습니다', error);
            }
        }
        setProfileImages(images);
    };

    const addCloseFriend = async (friendId) => {
        try {
            const response = await axios.post(`${SERVER_IP}/api/close-friends/add`, { userId, friendId }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            alert("친한 친구로 추가되었습니다!");
            fetchCloseFriendsList(); // Refresh the close friends list
        } catch (error) {
            console.error('친한 친구로 추가하는데 실패했습니다', error);
        }
    };

    const removeCloseFriend = async (friendId) => {
        try {
            await axios.delete(`${SERVER_IP}/api/close-friends/remove`, {
                data: { userId, friendId },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            alert("친한 친구에서 제거되었습니다!");
            fetchCloseFriendsList(); // Refresh the close friends list
        } catch (error) {
            console.error('친한 친구에서 제거하는데 실패했습니다', error);
        }
    };

    const blockFriend = async (friendshipId) => {
        try {
            await axios.post(`${SERVER_IP}/api/block/${friendshipId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setFriendsList(friendsList.filter(friend => friend.friendshipId !== friendshipId));
            setProfileImages(prevImages => {
                const { [friendshipId]: _, ...newImages } = prevImages;
                return newImages;
            });
            alert("친구가 차단되었습니다!");
            fetchBlockedFriendsList(); // Refresh the blocked friends list
        } catch (error) {
            console.error('친구를 차단하는데 실패했습니다', error);
        }
    };

    const unblockFriend = async (friendshipId) => {
        try {
            await axios.post(`${SERVER_IP}/api/unblock/${friendshipId}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setBlockedFriendsList(blockedFriendsList.filter(friend => friend.friendshipId !== friendshipId));
            fetchFriendsList(); // Refresh the friends list
            alert("친구 차단이 해제되었습니다!");
        } catch (error) {
            console.error('친구 차단을 해제하는데 실패했습니다', error);
        }
    };

    const removeFriend = async (friendshipId) => {
        try {
            await axios.delete(`${SERVER_IP}/api/user/friends/remove/${friendshipId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setFriendsList(friendsList.filter(friend => friend.friendshipId !== friendshipId));
            setProfileImages(prevImages => {
                const { [friendshipId]: _, ...newImages } = prevImages;
                return newImages;
            });
            alert("친구 삭제가 성공적으로 되었습니다!")
        } catch (error) {
            console.error('친구를 삭제하는데 실패했습니다', error);
        }
    };

    useEffect(() => {
        fetchFriendsList();
        fetchCloseFriendsList();
        fetchBlockedFriendsList();
    }, []);

    const renderFriendsList = (list) => {
        return list.map((friend) => (
            <li key={friend.friendshipId} className="flex justify-between items-center gap-x-6 py-5">
                <div className="flex items-center gap-x-4">
                    <img className="h-16 w-16 flex-none rounded-full bg-gray-50"
                         src={profileImages[friend.friendId]}
                         alt={`${friend.friendshipId}의 프로필`} />
                    <div className="min-w-0 flex-auto">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900">{friend.friendName}</h3>
                        <h3 className="mt-1 truncate text-base leading-5 text-gray-500">{friend.friendEmail}</h3>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
                    {activeList === "closeFriends" ? (
                        <div onClick={() => removeCloseFriend(friend.friendId)}
                             className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 cursor-pointer">
                            친한 친구 제거
                        </div>
                    ) : activeList === "blockedFriends" ? (
                        <div onClick={() => unblockFriend(friend.friendshipId)}
                             className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 cursor-pointer">
                            차단 해제
                        </div>
                    ) : (
                        <>
                            <div onClick={() => removeFriend(friend.friendshipId)}
                                 className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 cursor-pointer">
                                친구 삭제
                            </div>
                            <div onClick={() => addCloseFriend(friend.friendId)}
                                 className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 cursor-pointer">
                                친한 친구 추가
                            </div>
                            <div onClick={() => blockFriend(friend.friendshipId)}
                                 className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 cursor-pointer">
                                친구 차단
                            </div>
                        </>
                    )}
                </div>
            </li>
        ));
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-3">친구 목록</h2>
            <div className="flex justify-center mb-4">
                <button
                    className={`px-4 py-2 mx-2 ${activeList === "friends" ? "bg-blue-500" : "bg-gray-300"} text-white rounded-lg`}
                    onClick={() => setActiveList("friends")}
                >
                    친구
                </button>
                <button
                    className={`px-4 py-2 mx-2 ${activeList === "closeFriends" ? "bg-blue-500" : "bg-gray-300"} text-white rounded-lg`}
                    onClick={() => setActiveList("closeFriends")}
                >
                    친한 친구
                </button>
                <button
                    className={`px-4 py-2 mx-2 ${activeList === "blockedFriends" ? "bg-blue-500" : "bg-gray-300"} text-white rounded-lg`}
                    onClick={() => setActiveList("blockedFriends")}
                >
                    차단 친구
                </button>
            </div>
            <ul className="divide-y divide-gray-100 w-full max-w-4xl">
                {activeList === "friends" && renderFriendsList(friendsList)}
                {activeList === "closeFriends" && renderFriendsList(closeFriendsList)}
                {activeList === "blockedFriends" && renderFriendsList(blockedFriendsList)}
            </ul>
        </div>
    );
};

export default Second;
