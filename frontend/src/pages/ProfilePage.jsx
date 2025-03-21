import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProfilePage () {
    const { user } = useContext(AuthContext);

    if (!user) return <p>Please log in to view your profile.</p>;

    return (
        <div>
            <h1>Welcome, {user.username}!</h1>
            <p>Email: {user.email}</p>
            <p>User ID: {user.id}</p>
        </div>
    )
}

export default ProfilePage;