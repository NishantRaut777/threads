import { Flex, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import Post from '../components/Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';

const HomePage = () => {

  // using posts global state
  const [posts, setPosts] = useRecoilState(postsAtom);

  const [loading, setLoading] = useState(true);

  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      // with these this will add some loading time before loading posts on homepage
      setPosts([]);

      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();

        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);

      } catch (err) {
        showToast("Error", err.message, "error");
      } finally {
        setLoading(false);
      }
    }
    // call getFeedPosts 
    getFeedPosts();

  }, [showToast, setPosts]);

  return (
    <>
      { !loading && posts.length === 0 && <h1>Follow some users to see the feed.</h1>
      }

      { loading && (
        <Flex justify={"center"}>
            <Spinner size={"xl"} /> 
        </Flex>
      )}

      { posts.map((post) => (
        <Post key={post._id} post={post} postedBy = {post.postedBy}  />
      ))
      }
    </>
  )
}

export default HomePage
