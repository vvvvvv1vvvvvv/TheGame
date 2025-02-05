import { Box, Container, Text } from '@metafam/ds';
import BackgroundImage from 'assets/landing/build-background.png';
import { FullPageContainer } from 'components/Container';
import { useOnScreen } from 'lib/hooks/useOnScreen';
import { useRef } from 'react';

import { LandingNextButton } from './LandingNextButton';

export const Build: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useOnScreen(ref);
  const section = 'build-the-future';

  return (
    <FullPageContainer
      bgImageUrl={BackgroundImage}
      id={section}
      position="relative"
    >
      <Container
        d="flex"
        maxW={{ base: '100%', xl: '7xl', '2xl': '8xl' }}
        height="100%"
        alignItems="center"
      >
        <Box
          ref={ref}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          fontSize={{ base: '1.5rem', '2xl': '2.375rem' }}
          lineHeight={{ base: '2.35rem', '2xl': '3.5rem' }}
          maxWidth={{ base: 'unset', md: 'md', xl: 'lg', '2xl': '2xl' }}
          pl={{ base: 0, md: 0 }}
          zIndex={100}
          transform={`translate3d(0, ${onScreen ? '0' : '50px'}, 0)`}
          opacity={onScreen ? 1 : 0}
          transition="transform 0.3s 0.1s ease-in-out, opacity 0.5s 0.2s ease-in"
        >
          <Text fontWeight="normal" color="white">
            Many have already woken up to the world-shaping potential of Web3
            technologies.
          </Text>

          <Text
            pt={{ base: 5, '2xl': 10 }}
            fontWeight="normal"
            color="white"
            display="flex"
            flexDirection="column"
            maxWidth="32.75rem"
          >
            Some are grabbing the opportunity to build the future they want to
            live in.
          </Text>
        </Box>
      </Container>
      <LandingNextButton section="a-revolution" />
    </FullPageContainer>
  );
};
