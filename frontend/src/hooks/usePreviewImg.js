import React, { useState } from 'react';
import useShowToast from './useShowToast';

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);

  const showToast = useShowToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file && file.type.startsWith("image/")){
        const reader = new FileReader();

        // The loadend event is fired when a file read has completed
        reader.onloadend = () => {
            setImgUrl(reader.result);
        }

        // The readAsDataURL method is used to read the contents of the specified Blob or File.
        reader.readAsDataURL(file);
    } else{
        showToast("Invalid file type", "Please select an image file", "error");

        setImgUrl(null);
    }
  };

  return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;
