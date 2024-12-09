import React, { useEffect, useState } from 'react';
import Context from './Context';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, query, onSnapshot, getDocs, setDoc, deleteDoc, doc,getDoc, where,addDoc,updateDoc } from 'firebase/firestore';
import { auth, database } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

function AccountData(props) {
    const [users, setUsers] = useState([]);
    const [account, setAccount] = useState([]);
    const { id } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userAf, setUserAf] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUserAf(currentUser);
                getUserData(currentUser.uid);
            } else {
                setUserAf(null);
                setUsers(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const getUserData = async () => {
        setLoading(true);
        try {
            const result = await getDocs(collection(database, "Conturi"));
            const usersArray = [];
            result.forEach((doc) => {
                usersArray.push({ ...doc.data(), uid: doc.data().uid });
            });
            setUsers(usersArray);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.clear('users');
    };

    const [user] = useAuthState(auth);

    useEffect(() => {
        const fetchUserData = () => {
            auth.onAuthStateChanged((users) => {
                setUsers(users);
            });
        };

        fetchUserData();
    }, []);

 return (
        <Context.Provider value={{
            users, setUsers, isLoggedIn, logout, setIsLoggedIn, getUserData, setUserAf, userAf, id,account,
        }}>
            {props.children}
        </Context.Provider>
    );
}

export default AccountData;


