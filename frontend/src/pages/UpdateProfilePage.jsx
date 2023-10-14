import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { useRef, useState } from 'react';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';

export default function UpdateProfilePage() {

    // get access to user state
    const [user, setUser] = useRecoilState(userAtom);

    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: ""
    });

    // this will have file name 
    const fileRef = useRef(null);

    const showToast = useShowToast();

    // usePreviewImg hook handles image change
    const { handleImageChange, imgUrl } = usePreviewImg();

    // handling formsubmit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // update API CALL
            const res = await fetch(`/api/users/update/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...inputs, profilePic: imgUrl })
            });

            // updated user object
            const data = await res.json();
            
            if(data.error){
                showToast("Error", data.error, "error");
                return;
            }

            showToast("Success", "Profile updated successfully" , "success");
            setUser(data);
            // Once update set the user in localStorage
            localStorage.setItem("user-threads", JSON.stringify(data));
        } catch (error) {
            showToast("Error", error, "error");
        }
    }

  return (
    <form onSubmit={handleSubmit}>
    <Flex
      align={'center'}
      justify={'center'}
      my={6}
      >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.dark')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        >
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          
          <Stack direction={['column', 'row']} spacing={6}>
            <Center>
              <Avatar size="xl" 
              boxShadow={"md"}
            //   If image is updated then show that image else show user profile pic from DB 
              src={ imgUrl || user.profilePic} />

            </Center>
            <Center w="full">
              <Button w="full" 
              onClick={() => fileRef.current.click()}
              >Change Avatar</Button>
              {/* This input will handle selection of file */}
              <Input type='file' hidden ref={fileRef}  onChange={handleImageChange} />
            </Center>
          </Stack>
        </FormControl>

        <FormControl>
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="Enter Full Name"
            value={inputs.name}
            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>

        <FormControl>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="Enter UserName"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="Enter Email Address"
            value={inputs.email}
            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
            type="email"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Enter Bio"
            value={inputs.bio}
            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
            type="text"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Enter password"
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            _placeholder={{ color: 'gray.500' }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            bg={'red.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'red.500',
            }}>
            Cancel
          </Button>
          <Button
            bg={'green.400'}
            color={'white'}
            w="full"
            _hover={{
              bg: 'green.500',
            }}
            type='submit'
            >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
    </form>
  )
};