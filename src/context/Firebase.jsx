import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    onAuthStateChanged
    } from "firebase/auth";
import { 
    getFirestore,
    collection, 
    addDoc,
    getDocs,
    getDoc,
    doc,
    query,
    where
    } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import {} from 'dotenv/config';
 
const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID
  };
  

export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const googleProvider = new GoogleAuthProvider();

export const FirebaseProvider = (props) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, user => {
            if(user) setUser(user);
            else setUser(null);
        })
    }, [])

    const signupUSerWithEmailAndPassword = (email, password) => {
        createUserWithEmailAndPassword(firebaseAuth, email, password)
    }

    const signinUserWithEmailAndPass = (email, password) => {
        signInWithEmailAndPassword(firebaseAuth, email, password)
    }

    const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider)

    const handleCreateNewListing = async (name, isbn, price, cover) => {
        const imageRef = ref(storage, `uploads/images/${Date.now().toString()}${cover.name}`);
        const uploadResult = await uploadBytes(imageRef, cover);
        return await addDoc(collection(firestore, 'books'), {
            name,
            isbn,
            price,
            imageURL : uploadResult.ref.fullPath,
            userID : user.uid,
            userEmail : user.email,
            displayName : user.displayName,
            photoURL : user.photoURL,
        })
    };

    const listAllBooks = () => {
        return getDocs(collection(firestore, "books"));
    };

    const getBookById = async (id) => {
        const docRef = doc(firestore, 'books', id);
        const result = await getDoc(docRef);
        return result;
    } 

    const getImageURL = (path) => {
        return getDownloadURL(ref(storage, path))
    }

    const placeOrder = async (bookId, qty) => {
        const collectionRef = collection(firestore, 'books', bookId, "orders")

        const result = await addDoc (collectionRef, { 
            userID : user.uid,
            userEmail : user.email,
            displayName : user.displayName,
            photoURL : user.photoURL,
            qty: Number(qty)
        });
        return result;
    };

    const fetchMyBooks = async (userId) => {
        const collectionRef = collection(firestore, 'books');
        const q = query(collectionRef, where("userID", "==", userId));

        const result = await getDocs(q);
        return result;
    }

    const getOrders = async (bookId) => {
        const collectionRef = collection(firestore, "books", bookId, 'orders');
        const result = await getDocs(collectionRef);

        return result;
    }

    const isLoggedIn = user ? true : false;

    return <FirebaseContext.Provider 
    value={{ 
        signupUSerWithEmailAndPassword, 
        signinUserWithEmailAndPass, 
        signinWithGoogle,
        isLoggedIn,
        handleCreateNewListing,
        listAllBooks,
        getImageURL,
        getBookById,
        placeOrder,
        fetchMyBooks,
        user,
        getOrders
    }} 
    >
        {props.children}
    </FirebaseContext.Provider>

};