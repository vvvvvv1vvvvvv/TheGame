import { SetupProfile } from 'components/Setup/SetupProfile';
import { SetupUsername } from 'components/Setup/SetupUsername';
import { SetupContextProvider } from 'contexts/SetupContext';
import { InferGetStaticPropsType } from 'next';
import React from 'react';

export const getStaticProps = async () => ({
  props: {
    hideTopMenu: true,
  },
});

export type DefaultSetupProps = InferGetStaticPropsType<typeof getStaticProps>;

const UsernameSetup: React.FC<DefaultSetupProps> = () => (
  <SetupContextProvider>
    <SetupProfile>
      <SetupUsername />
    </SetupProfile>
  </SetupContextProvider>
);

export default UsernameSetup;
