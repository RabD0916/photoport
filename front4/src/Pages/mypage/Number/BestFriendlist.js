import React, { useState, useEffect } from "react";
import axios from "axios";

const BestFriend = () => {
    const SERVER_IP = process.env.REACT_APP_SERVER_IP;
    const userId = localStorage.getItem("id");
    const [closeFriendsList, setCloseFriendsList] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const accessToken = localStorage.getItem("accessToken");

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

    const removeCloseFriend = async (friendName) => {
        try {
            await axios.delete(`${SERVER_IP}/api/close-friends/remove`, {
                data: { userId, friendName },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setCloseFriendsList(closeFriendsList.filter(friend => friend.friendName !== friendName));
            setProfileImages(prevImages => {
                const { [friendName]: _, ...newImages } = prevImages;
                return newImages;
            });
            alert("친한 친구 삭제가 성공적으로 되었습니다!");
        } catch (error) {
            console.error('친한 친구를 삭제하는데 실패했습니다', error);
        }
    };

    useEffect(() => {
        fetchCloseFriendsList();
    }, []);

    return (
        <div>
            <div>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mt-3">친한 친구 목록</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                    {closeFriendsList.map((friend) => (
                        <li key={friend.friendshipId} className="flex justify-between gap-x-6 py-5">
                            <div className="flex min-w-0 gap-x-4">
                                <img className="h-16 w-16 flex-none rounded-full bg-gray-50"
                                     src={profileImages[friend.friendId]}
                                     alt={`${friend.friendshipId}의 프로필`} />
                                <div className="min-w-0 flex-auto">
                                    <h3 className="text-lg font-semibold leading-6 text-gray-900">{friend.friendName}</h3>
                                    <h3 className="mt-1 truncate text-base leading-5 text-gray-500">{friend.friendEmail}</h3>
                                </div>
                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                    <div onClick={() => removeCloseFriend(friend.friendName)}
                                         className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 cursor-pointer">
                                        친한 친구 삭제
                                    </div>
                                    <p className="text-sm leading-6 text-gray-900">{friend.role}</p>
                                    {friend.lastSeen ? (
                                        <p className="mt-1 text-xs leading-5 text-gray-500">
                                            Last seen <time dateTime={friend.lastSeenDateTime}>{friend.lastSeen}</time>
                                        </p>
                                    ) : (
                                        <div className="mt-1 flex items-center gap-x-1.5">
                                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            </div>
                                            <p className="text-xs leading-5 text-gray-500">Online</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default BestFriend;
