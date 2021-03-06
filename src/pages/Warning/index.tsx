import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import firestore from '@react-native-firebase/firestore';

import { WarnContainer, WarnList, WarnText, TitleContainer, Title } from './styles';

export interface Warn {
  id: string;
  title: string;
  text: string;
}

const Warning: React.FC = () => {
  const [warn, setWarn] = useState<Warn[]>([]);


  useEffect(() => {
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
            arrOfWarns.push(getOneWarn);
          });
          setWarn(arrOfWarns);
        });
    }


    getWarns();
  },[])

  return (
    <>
      <Header children='Avisos' arrowGoBack={false} logoutButton={false}/>
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
