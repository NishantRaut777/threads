import React from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'

const UserPage = () => {
  return (
    <>
        <UserHeader />
        <UserPost likes={1200} replies={400} postImg="/post1.png" postTitle="Let's talk about threads." />
        <UserPost likes={1000} replies={300} postImg="/post2.png" postTitle="Nice tutorial." />
        <UserPost likes={22200} replies={1000} postImg="/post3.png" postTitle="I love Elon." />
        <UserPost likes={120} replies={50} postTitle="This is my first thread." />
    </>
  )
}

export default UserPage
