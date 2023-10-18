import { Avatar, Flex, Image, Text, Box, Divider, Button, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Actions from '../components/Actions';
import Comment from '../components/Comment';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { DeleteIcon } from '@chakra-ui/icons';

const PostPage = () => {
  const { user, loading } = useGetUserProfile();

  const [post, setPost] = useState(null);

  const showToast = useShowToast();

  const { pid } = useParams();

  const currentUser = useRecoilValue(userAtom);

  const navigate = useNavigate();

  useEffect(()=> {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setPost(data);

      } catch (err) {
        showToast("Error", err.message, "error");
      }
    }

    getPost();
  }, [showToast, pid]);

  // handling delete post
  const handleDeletePost = async() => {
    try {

        // If user dont want delete post return from function
        if(!window.confirm("Are you sure you want to delete this post?")) return;

        const res = await fetch(`/api/posts/${post._id}`, {
            method: "DELETE"
        });

        const data = await res.json();
        if (data.error) {
            showToast("Error", data.error, "error");
            return;
        }
        showToast("Success", "Post deleted", "success");
        navigate(`/${user.username}`);

    } catch (err) {
        showToast("Error", err.message, "error");
    }
  };

  if(!user && loading){
    return (
      <Flex justifyContent={"center"}>
            <Spinner size={"xl"} />
      </Flex>
    )
  }

  // because i am passing post as a prop to Action
  if (!post) {
    return null;
  }

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name="Mark Zuckerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>

          {/* show delete icon for logged in user's posts only */}
          {currentUser?._id === user?._id && (
            <DeleteIcon size={20} 
            cursor={"pointer"}
            onClick={handleDeletePost} />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{post.text}</Text>

      {post.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={post.img} w={"full"} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={post} />
      </Flex>

      
      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>🫰</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />

        { post.replies.map(reply => (
          <Comment
            key={reply._id}
            reply={reply}
            lastReply = {reply._id === post.replies[post.replies.length - 1]._id}
          />
        ))}
      

      
    </>
  );
}

export default PostPage
