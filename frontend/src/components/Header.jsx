import { Flex, Image, Link, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";

const Header = () => {
    // useColorMode helps to toggle between dark and light mode
    const { colorMode, toggleColorMode } = useColorMode();

    const user = useRecoilValue(userAtom);

  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>

        {/* If user loggedIn then show this logo */}
        { user && (
          <Link as={RouterLink} to="/">
            <AiFillHome size={24} />
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
          <Link as={RouterLink} to={`/${user.username}`}  >
            <RxAvatar size={24} />
          </Link>
        )}
    </Flex>
  );
};

export default Header;
