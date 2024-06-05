/* eslint-disable */
import React, { createContext, useContext, useState } from 'react';

const ProfileImageContext = createContext();

export const useProfileImage = () => useContext(ProfileImageContext);

export const ProfileImageProvider = ({ children }) => {
  const [profileImageUrl, setProfileImageUrl] = useState('');

  const updateProfileImage = (url) => {
    setProfileImageUrl(url);
  };

  return (
    <ProfileImageContext.Provider value={{ profileImageUrl, updateProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
};
