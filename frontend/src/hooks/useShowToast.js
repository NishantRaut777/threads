import React, { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';


// this function will be useful to show toast messages throughout website

const useShowToast = () => {
  const toast = useToast();

  const showToast = useCallback(
    (title, description, status) => {
        toast({
            title: title,
            description: description,
            status: status,
            duration: 3000,
            isClosable: true
        });
      },
      [toast]
      );

      return showToast;
  };

export default useShowToast;
