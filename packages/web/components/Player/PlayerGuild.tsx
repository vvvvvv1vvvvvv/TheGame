import { Link, LinkProps } from '@metafam/ds';
import React from 'react';

type LinkGuildProps = {
  daoURL: string | null;
  guildname: string | undefined | null;
};

export const LinkGuild: React.FC<LinkGuildProps> = ({
  daoURL,
  guildname,
  children,
}) => {
  if (guildname != null) {
    return <InternalGuildLink guildName={guildname} {...{ children }} />;
  }
  if (daoURL != null) {
    return <DaoHausLink {...{ daoURL, children }} />;
  }
  return <>{children}</>;
};

type InternalGuildLinkProps = {
  guildName: string;
};

export const InternalGuildLink: React.FC<InternalGuildLinkProps> = ({
  guildName,
  children,
}) => (
  <Link _hover={{ textDecoration: 'none' }} href={`/guild/${guildName}`}>
    {children}
  </Link>
);

type DaoHausLinkProps = {
  daoURL: string | null;
};

export const DaoHausLink: React.FC<DaoHausLinkProps & LinkProps> = ({
  daoURL,
  children,
  _hover = {},
  ...props
}) => {
  _hover.textDecoration = 'none'; // eslint-disable-line no-param-reassign

  if (daoURL != null) {
    return (
      <Link href={daoURL} isExternal {...{ _hover, ...props }}>
        {children}
      </Link>
    );
  }

  return <>{children}</>;
};
