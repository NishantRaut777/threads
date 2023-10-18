import { Button, Flex, Image, Link, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import useLogout from '../hooks/useLogout';
import authScreenAtom from '../atoms/authAtom';

const Header = () => {
    // useColorMode helps to toggle between dark and light mode
    const { colorMode, toggleColorMode } = useColorMode();

    const user = useRecoilValue(userAtom);

    // using logout hook
    const logout = useLogout();

    const setAuthScreen = useSetRecoilState(authScreenAtom);

  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>

        {/* If user loggedIn then show this logo */}
        { user && (
          <Link as={RouterLink} to="/">
            <AiFillHome size={24} />
          </Link>
        )}
        
        {/* If user not loggedIn then show this */}
        { !user && (
          <Link as={RouterLink} to={"/auth"}
          onClick={ () => setAuthScreen("login")}
          >
            Login
          </Link>
        )}

        <Image 
            cursor={"pointer"}
            alt='Logo'
            w={6}
            src={ colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg" }
            onClick={toggleColorMode}
        />

        {/* If user loggedIn then show this logo */}
        { user && (
          <Flex alignItems={"center"} gap={4}>
            <Link as={RouterLink} to={`/${user.username}`}  >
              <RxAvatar size={24} />
            </Link>

            <Button size={"xs"} onClick={logout}>
                Logout
            </Button>
          </Flex>
        )}

        {/* If user not loggedIn then show this  */}
        { !user && (
          <Link as={RouterLink} to={"/auth"}
          onClick={ () => setAuthScreen("signup")}
          >
            Sign up
          </Link>
        )}

    </Flex>
  );
};

export default Header;
