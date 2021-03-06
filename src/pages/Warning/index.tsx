import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Header from '../../components/Header';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';


import { Container, WarnContainer, WarnList, WarnText, TitleContainer, Title } from './styles';

interface Warn {
  id: string;
  title: string;
  text: string;
}

const Warning: React.FC = () => {
  const [warn, setWarn] = useState<Warn>();

  const getWarns = () => {
    firestore()
      .collection('warns')
      .get()
      .then((warns) => {
        const arrOfWarns: any = [];
        warns.forEach((warn) => {
          const getOneWarn: Warn = {
            id: warn.id,
            title: warn.data().title,
            text: warn.data().text,
          };
          console.log(getOneWarn);
          arrOfWarns.push(getOneWarn);
        });
        setWarn(arrOfWarns);
      });
  }

  useEffect(() => {
    getWarns();
  },[])

  return (
    <>
      <Header children='Avisos' arrowGoBack={false} />
        <WarnList
          data={warn}
          keyExtractor={(warn) => warn.id}
          renderItem={({ item: warn }) => (
            <WarnContainer>
              <TitleContainer>
                <Title>{warn.title}</Title>
              </TitleContainer>
              <WarnText>{warn.text}</WarnText>
            </WarnContainer>
          )}
        />
    </>
  );
}

export default Warning;
