import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import urls from '../url';
import './UserList.css'

//** Component to show cards of user on directory page */
const ClickableCard = ({ userName, postCount, userId, userDetails, postData }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        console.log(`Card with id ${userId} clicked!`);
        navigate(`/user/${userId}`, { state: { userDetails, postData } }); // Use navigate to go to the user's unique page
    };

    return (
        <div className="clickable-card" onClick={handleCardClick}>
            <div className="user-info">
                <p className="user-name">{`Name: ${userName}`}</p>
                <p className="post-count">{`Posts: ${postCount}`}</p>
            </div>
        </div>
    );
};

const UserList = () => {
    const [userData, setUserData] = useState(null);
    const [postsdata, setPostsData] = useState(null);
    const [postCounts, setPostCounts] = useState({});
    const [error, setError] = useState(null);
    const [clickedCardId, setClickedCardId] = useState(null);
    const [post, setPost] = useState({});

    //** useEffect to call user and post data API */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, postsResponse] = await Promise.all([
                    fetch(urls.useListUrl),
                    fetch(urls.postsUrl),
                ]);

                if (!usersResponse.ok) {
                    throw new Error(`HTTP error for users API! Status: ${usersResponse.status}`);
                }

                if (!postsResponse.ok) {
                    throw new Error(`HTTP error for posts API! Status: ${postsResponse.status}`);
                }

                const users = await usersResponse.json();
                const posts = await postsResponse.json();

                setUserData(users);
                setPostsData(posts);

                const counts = {};
                posts.forEach(post => {
                    counts[post.userId] = (counts[post.userId] || 0) + 1;
                });
                setPostCounts(counts);

                // Group posts by userId
                const groupedPosts = posts.reduce((acc, post) => {
                    const { userId, ...rest } = post;
                    if (!acc[userId]) {
                        acc[userId] = [];
                    }
                    acc[userId].push(rest);
                    return acc;
                }, {});

                setPost(groupedPosts)


            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Directory</h1>
            {userData ? userData.map((user) =>
                <ClickableCard
                    key={user.id}
                    userName={user.name}
                    postCount={postCounts[user.id] || 0}
                    userId={user.id}
                    userDetails={user}
                    postData={post[user.id] || 0}
                />
            )
                : null}
        </div>
    );
};

export default UserList;