import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';


import AsyncStorage from '@react-native-community/async-storage';

import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

interface AuthState {
  user: object;
  email: string;
}

interface AuthContext {
  user: object;
  loginWithGoogle(): Promise<void>;
  SignOut(): Promise<void>;
}

const AuthContext = createContext<AuthContext>({} as AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [user, email] = await AsyncStorage.multiGet([
        '@IPBMorungaba:user',
        '@IPBMorungaba:email'
      ]);


      if(user[1] && email[1]) {
        setData({ user: JSON.parse(user[1]), email: email[1] });
      }
    }

    loadStorageData();
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const { idToken } = await GoogleSignin.signIn();

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    const userLogin = await auth().signInWithCredential(googleCredential);
    const { user } = userLogin;
    const email = JSON.stringify(user.email);

    await AsyncStorage.multiSet([
      ['IPBMorungaba:user', JSON.stringify(user)],
      ['IPBMorungaba:email', email]
    ]);

    setData({ user, email })
  }, []);

  const SignOut = useCallback(async () => {
    try {
      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()

      await AsyncStorage.multiRemove([
        'IPBMorungaba:user',
        'IPBMorungaba:email'
      ])

      setData({} as AuthState)
    } catch (error) {
      Alert.alert('Something else went wrong... ', error.toString())
    }
  },[])

  return (
    <AuthContext.Provider value={{ user: data.user, loginWithGoogle, SignOut}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContext {
  const context = useContext(AuthContext)

  if(!context){
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}