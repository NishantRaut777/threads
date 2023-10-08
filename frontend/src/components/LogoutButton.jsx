import { Button } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';


const LogoutButton = () => {
    const setUserState = useSetRecoilState(userAtom);

    // calling showToast
    const showToast = useShowToast();

    const handleLogout = async() => {
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

  return (
    <Button
        position={"fixed"}
        top={"30px"}
        right={"30px"}
        size={"sm"}
        onClick={handleLogout}
    >
        Logout
    </Button>
  )
};

export default LogoutButton;
