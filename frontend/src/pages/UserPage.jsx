import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';

const UserPage = () => {

  const [user, setUser] = useState(null);

  // useparams hook will give access to value passed in url
  const { username } = useParams();

  const showToast = useShowToast();

  // calling getUserby name in useEffect
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);

        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }

        setUser(data);

      } catch(err){
        showToast("Error", err , "error");
      }
    };

    getUser();
  }, [username, showToast]);

  // if no user found then return null
  if(!user){
    return null;
  }

  return (
    <>
        <UserHeader user= {user} />
        <UserPost likes={1200} replies={400} postImg="/post1.png" postTitle="Let's talk about threads." />
        <UserPost likes={1000} replies={300} postImg="/post2.png" postTitle="Nice tutorial." />
        <UserPost likes={22200} replies={1000} postImg="/post3.png" postTitle="I love Elon." />
        <UserPost likes={120} replies={50} postTitle="This is my first thread." />
    </>
  )
}

export default UserPage
