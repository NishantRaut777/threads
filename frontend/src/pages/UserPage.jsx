import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader';
import { useParams } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';
import Post from "../components/Post";

const UserPage = () => {

  const [user, setUser] = useState(null);

  // useparams hook will give access to value passed in url
  const { username } = useParams();

  const showToast = useShowToast();

  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);

  const [fetchingPosts, setFetchingPosts] = useState(true);

  // calling getUserby name and getposts in useEffect
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
        showToast("Error", err.message , "error");
      } finally {
        setLoading(false);
      }
    };

    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log(data);

        setPosts(data);

      } catch (err) {
        showToast("Error", err.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getUser();
    getPosts();
  }, [username, showToast]);

  if(!user && loading){
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    )
  }

  // if no user found then return User not found
  if(!user && !loading){
    return <h1>User not found</h1>;
  }

  return (
    <>
        <UserHeader user= {user} />

        {/* If fetching posts is false and there are no posts then display this message */}
        { !fetchingPosts && posts.length === 0 && <h1>User doesn't have any posts.</h1>}

        { fetchingPosts && (
          <Flex justifyContent={"center"} my={12}>
            <Spinner size={"xl"}/>
          </Flex>
        )} 

        { posts.map((post) => (
          <Post  key={post._id} post={post} postedBy={post.postedBy} />
        ))}
    </>
  )
}

export default UserPage
