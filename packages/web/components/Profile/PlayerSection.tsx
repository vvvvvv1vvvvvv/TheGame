import { Flex, IconButton } from '@metafam/ds';
import { PlayerAchievements } from 'components/Player/Section/PlayerAchievements';
import { PlayerColorDisposition } from 'components/Player/Section/PlayerColorDisposition';
import { PlayerCompletedQuests } from 'components/Player/Section/PlayerCompletedQuests';
import { PlayerGallery } from 'components/Player/Section/PlayerGallery';
import { PlayerHero } from 'components/Player/Section/PlayerHero';
import { PlayerMemberships } from 'components/Player/Section/PlayerMemberships';
import { PlayerRoles } from 'components/Player/Section/PlayerRoles';
import { PlayerSkills } from 'components/Player/Section/PlayerSkills';
import { PlayerType } from 'components/Player/Section/PlayerType';
import { EmbeddedUrl } from 'components/Profile/EmbeddedUrlSection';
import { Player } from 'graphql/autogen/types';
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { BoxMetadata, BoxType, BoxTypes, createBoxKey } from 'utils/boxTypes';

type Props = {
  type: BoxType;
  metadata?: BoxMetadata;
  player: Player;
  isOwnProfile?: boolean;
  editing?: boolean;
  onRemoveBox?: (boxKey: string) => void;
};

const PlayerSectionInner: React.FC<Props> = ({
  metadata,
  type,
  player,
  isOwnProfile,
  editing,
}) => {
  switch (type) {
    case BoxTypes.PLAYER_HERO:
      return <PlayerHero {...{ player, editing }} />;
    case BoxTypes.PLAYER_SKILLS:
      return <PlayerSkills {...{ player, isOwnProfile, editing }} />;
    case BoxTypes.PLAYER_NFT_GALLERY:
      return <PlayerGallery {...{ player, isOwnProfile, editing }} />;
    case BoxTypes.PLAYER_DAO_MEMBERSHIPS:
      return <PlayerMemberships {...{ player, isOwnProfile, editing }} />;
    case BoxTypes.PLAYER_COLOR_DISPOSITION:
      return <PlayerColorDisposition {...{ player, editing }} />;
    case BoxTypes.PLAYER_TYPE:
      return <PlayerType {...{ player, editing }} />;
    case BoxTypes.PLAYER_ROLES:
      return <PlayerRoles {...{ player, isOwnProfile, editing }} />;
    case BoxTypes.PLAYER_ACHIEVEMENTS:
      return <PlayerAchievements {...{ player, isOwnProfile, editing }} />;
    case BoxTypes.PLAYER_COMPLETED_QUESTS:
      return <PlayerCompletedQuests {...{ player, isOwnProfile, editing }} />;
    case BoxTypes.EMBEDDED_URL: {
      const { url } = metadata ?? {};
      return url ? <EmbeddedUrl {...{ url, editing }} /> : null;
    }
    default:
      return null;
  }
};

export const PlayerSection = React.forwardRef<HTMLDivElement, Props>(
  ({ metadata, type, player, isOwnProfile, editing, onRemoveBox }, ref) => {
    const key = createBoxKey(type, metadata);

    return (
      <Flex
        w="100%"
        {...{ ref }}
        direction="column"
        h="auto"
        minH="100%"
        boxShadow="md"
        pos="relative"
      >
        <PlayerSectionInner
          {...{
            metadata,
            type,
            player,
            isOwnProfile,
            editing,
          }}
        />
        {editing && (
          <Flex
            className="gridItemOverlay"
            w="100%"
            h="100%"
            bg="purpleTag50"
            pos="absolute"
            top={0}
            left={0}
          />
        )}
        {editing && type && type !== BoxTypes.PLAYER_HERO && (
          <IconButton
            aria-label="Remove Profile Section"
            size="lg"
            pos="absolute"
            top={0}
            right={0}
            bg="transparent"
            color="pinkShadeOne"
            icon={<FaTimes />}
            _hover={{ color: 'white' }}
            onClick={() => onRemoveBox?.(key)}
            _focus={{
              boxShadow: 'none',
              backgroundColor: 'transparent',
            }}
            _active={{
              transform: 'scale(0.8)',
              backgroundColor: 'transparent',
            }}
            isRound
          />
        )}
      </Flex>
    );
  },
);
