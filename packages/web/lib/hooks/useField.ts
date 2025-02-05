import { httpLink, Maybe, Optional } from '@metafam/utils';
import { ExplorerType, Player, Profile } from 'graphql/autogen/types';
import { Atom, atom as newAtom, PrimitiveAtom, useAtom } from 'jotai';
import { optimizedImage } from 'utils/imageHelpers';

// eslint-disable-next-line import/no-cycle
import { useUser } from './useUser';

export type ProfileFieldType<T> = {
  [field in keyof Profile]?: Maybe<T>;
} & {
  value: Maybe<T>;
  setter: Maybe<(value: unknown) => void>;
  owner: Maybe<boolean>;
  user: Maybe<Player>;
  fetching: boolean;
};

export type ProfileValueType = string | number | Array<string> | ExplorerType;

let fields: Record<string, Atom<Maybe<unknown>>> = {};
const nullAtom = newAtom(null, () => {
  throw new Error('Unimplemented');
});

export const clearJotaiState = () => {
  fields = {};
};

export const useProfileField = <T extends ProfileValueType = string>({
  field,
  player = null,
  getter = null,
}: {
  field: string;
  player?: Maybe<Player>;
  getter?: Maybe<(player: Maybe<Player>) => Optional<Maybe<T>>>;
}): ProfileFieldType<T> => {
  const { fetching, user } = useUser();
  player ??= user; // eslint-disable-line no-param-reassign
  const owner = user ? user.id === player?.id : null;
  const key = field as keyof Profile;
  let value = player?.profile?.[key];
  let setter: Maybe<(val: unknown) => void> = null;
  let atom = owner ? fields[field] : null;
  if (!atom && owner) {
    // eslint-disable-next-line no-multi-assign
    fields[field] = atom = newAtom<Maybe<T>>(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const response = useAtom(
    (atom ?? nullAtom) as PrimitiveAtom<Maybe<typeof value>>,
  );
  if (atom) {
    [value, setter] = response;
  }

  // to unset, set value = null
  if (value == null) {
    value = getter?.(player);
  }

  if (typeof value === 'string' && /^\w{1,10}:\/\/./.test(value)) {
    if (field.endsWith('ImageURL')) {
      value = optimizedImage(field, value);
    } else if (field.endsWith('URL')) {
      value = httpLink(value);
    }
  }

  return {
    value,
    setter,
    [field]: value,
    owner,
    user,
    fetching,
  };
};

export const useOverridableField = <T = string>({
  field,
  defaultValue = null,
  loaded = true,
}: {
  field: string;
  defaultValue?: Maybe<T>;
  loaded?: boolean;
}) => {
  let value: Maybe<T> = defaultValue ?? null;
  let setter: Maybe<(val: unknown) => void> = null;
  let atom = fields[field] ?? null;
  if (!atom && (loaded || !!value)) {
    // eslint-disable-next-line no-multi-assign
    fields[field] = atom = newAtom<Maybe<T>>(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const ret = useAtom((atom ?? nullAtom) as PrimitiveAtom<Maybe<T>>);
  if (atom) {
    value = ret[0] as Maybe<T>;
    setter = ret[1] as Maybe<(val: unknown) => void>;
  }

  return {
    value,
    setter,
    [field]: value,
  };
};
