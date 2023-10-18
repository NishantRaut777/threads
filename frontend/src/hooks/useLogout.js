import React from 'react'
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';
import { Navigate } from 'react-router-dom';

const useLogout = () => {

    const setUserState = useSetRecoilState(userAtom);

    const showToast = useShowToast();
  
    const logout = async() => {
        try{
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();

            if(data.error){
                showToast("ERROR", data.error, "error");

                // After displaying toast return from this function
                return;
            }
            
            // After successful logout remove data from localstorage and set User state
            localStorage.removeItem("user-threads");
            setUserState(null);

        } catch(err){
            showToast("ERROR", err, "error");
        }
    };

    return logout;
}

export default useLogout
