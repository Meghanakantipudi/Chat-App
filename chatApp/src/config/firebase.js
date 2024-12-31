// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, query, collection, where, getDocs } from "firebase/firestore"; 
import { toast } from "react-toastify";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6a_8Y06Jr6ot07_j1523oF4pp5E6MrMA",
  authDomain: "chat-app-gs-eae1e.firebaseapp.com",
  projectId: "chat-app-gs-eae1e",
  storageBucket: "chat-app-gs-eae1e.firebasestorage.app",
  messagingSenderId: "91656981859",
  appId: "1:91656981859:web:08ab38be467f6ed95bd756",
  measurementId: "G-YTW95KK9ZM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const signUp = async (userName, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: userName.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey, There i am using chat app",
            lastSeen: Date.now(),
        });
        await setDoc(doc(db, "chats", user.uid), {
            chatsData: [],
        });
    } catch (error) {
        console.log(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
};

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.log(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
};

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.log(error);
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
};

const resetPass = async (email) => {
    try {
        if(!email) {
            toast.error("Please enter an email");
        }
        else {
            const q = query(
                collection(db, "users"),
                where('email', '==', email)
              );
            const querySnapshot = await getDocs(q);
            if(!querySnapshot.empty) {
                const user = querySnapshot.docs[0].data();
                await sendPasswordResetEmail(auth, user.email);
                toast.success("Reset link sent to your email");
            }
            else {
                toast.error("Email does not exist");
            }
        }

    } catch(error){
        toast.error(error.message);
    }
}

export { signUp, login, logout, auth, db, resetPass };
