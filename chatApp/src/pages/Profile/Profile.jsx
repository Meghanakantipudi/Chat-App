import React from "react";
import assets from "../../assets/assets";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";
import { updateDoc } from "firebase/firestore";
import upload from "../../lib/upload.js";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Profile = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState(null);
  const [prevImage, setPrevImage] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', uid);
      if(!prevImage && !image) toast.error("Please upload an image");

      if(image) {
        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(userRef, {
          avatar: imgUrl,
          name,
          bio
        })
      }
      else {
        await updateDoc(userRef, {
          name,
          bio
        })
      }

      const snap = await getDoc(userRef);
      setUserData(snap.data());
      navigate("/chat")
    }
    catch (error) {
      toast.error(error.message);
    }
  } 

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if(user) {
        setUid(user.uid);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if(userSnap.exists()) {
          const userData1 = userSnap.data();
          if(userData1) {
            if(userData1.name) setName(userData1.name);
            if(userData1.avatar) setPrevImage(userData1.avatar);
            if(userData1.bio) setBio(userData1.bio);
          }
          else navigate("/");
        }
      }
    })
  }, [])

  return (
    <div className="bg-[url('../../../background.png')] bg-cover bg-center h-screen w-screen flex items-center justify-center">
      <div className="flex rounded-xl bg-white justify-start content-center space-x-20 w-1/2">
        <div className="flex flex-col space-y-8 w-1/2 m-14">
          <h1 className="font-medium text-3xl">Profile details</h1>
          <form className="flex flex-col space-y-6" onSubmit={onSubmitHandler}>
            <label className="flex justify-start items-center gap-x-4" htmlFor="avatar">
              <input
                className="hidden"
                type="file"
                id="avatar"
                name="avatar"
                accept=".png .jpeg .jpg"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <img className="cursor max-w-20 aspect-square rounded-full" src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
              <p className="text-2xl opacity-20">upload profile image</p>
            </label>
            <input className="border-2 p-4 rounded" type="text" placeholder="Your name" onChange={(e) => setName(e.target.value)} value={name} required/>
            <textarea className="border-2 p-4 rounded" type="text" placeholder="Hey, There i am using chat app" onChange={(e) => setBio(e.target.value)} value={bio} required/>
            <button className="bg-blue-600 text-white font-medium text-xl p-4 rounded cursor" type="submit" required>Save</button>
          </form>
        </div>
        <img className="w-60 rounded-full aspect-square overflow-hidden m-auto" src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
      </div>
    </div>
  );
};

export default Profile;
