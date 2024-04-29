import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

export function UserAvatar() {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUserPhoto(user.photoURL);
        setUserName(user.displayName);
      } else {
        // User is signed out
        setUserPhoto(null);
        setUserName(null);
      }
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("USER PHOTO: ", userPhoto);
    console.log("USER NAME: ", userName);
  }, [userName]);
  return (
    <div className="flex gap-x-20">
      <Avatar>
        <AvatarImage src={userPhoto || "../../static/imgs/test.png"} />
      </Avatar>
      <h4>{userName}</h4>
    </div>
  );
}

export default UserAvatar;
