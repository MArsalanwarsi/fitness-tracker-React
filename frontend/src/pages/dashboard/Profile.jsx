import React from 'react'
import ProfileHeader from "@/components/profile-header"
import ProfileContent from "@/components/profile-content"
import { useSelector } from "react-redux";

const Profile = () => {
    const userData = useSelector((state) => state.auth.user);
    console.log("User data in Profile component:", userData);
    return (
        <>
            <div className="container mx-auto space-y-6 px-4 py-10">
                <ProfileHeader data={userData} />
                <ProfileContent data={userData} />
            </div>
        </>
    )
}

export default Profile