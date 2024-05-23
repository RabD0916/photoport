import React, { useState, useEffect } from "react";
import axios from "axios";

const Second = () => {
    const [friendsList, setFriendsList] = useState([]);

    const fetchFriendsList = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user/friendsList', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setFriendsList(response.data);
        } catch (error) {
            console.error('Failed to fetch friends list', error);
        }
    };

    const removeFriend = async (friendshipId) => {
        try {
            await axios.delete(`http://localhost:8080/api/user/friends/remove/${friendshipId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            // 성공적으로 삭제된 후, 친구 목록에서 해당 친구를 제거합니다.
            setFriendsList(friendsList.filter(friend => friend.friendshipId !== friendshipId));
            alert("친구 삭제가 성공적으로 되었습니다!")
        } catch (error) {
            console.error('Failed to remove friend', error);
        }
    };

    //친구 차단
    // const banFriend =async (friendshipId) =>{
    //     try{
    //         await axios.delete()
    //     }
    //
    // }

    useEffect(() => {
        fetchFriendsList();
    }, []);

    return(
        <div>
            <h2>친구 목록</h2>
            <ul>
                {friendsList.map((friend) => (
                    <li key={friend.friendshipId}>
                        {friend.friendName}
                        <button onClick={() => removeFriend(friend.friendshipId)}>친구 삭제</button>
                        <button onClick={() => banFriend(friend.friendshipId)}>친구 차단</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Second;