/* istanbul ignore file */
import cityTimezones from 'city-timezones';
import React, { useCallback, useState } from 'react';
import { Styles } from 'react-select';
import TimezoneSelect, { TimezoneSelectProps } from 'react-timezone-select';
import spacetime from 'spacetime';
import informal from 'spacetime-informal';

import { theme } from './theme';

const i18nTimezones = {
  'Pacific/Midway': 'Midway Island, Samoa',
  'Pacific/Honolulu': 'Hawaii',
  'America/Juneau': 'Alaska',
  'America/Boise': 'Mountain Time',
  'America/Dawson': 'Dawson, Yukon',
  'America/Chihuahua': 'Chihuahua, La Paz, Mazatlan',
  'America/Phoenix': 'Arizona',
  'America/Chicago': 'Central Time',
  'America/Regina': 'Saskatchewan',
  'America/Mexico_City': 'Guadalajara, Mexico City, Monterrey',
  'America/Belize': 'Central America',
  'America/Detroit': 'Eastern Time',
  'America/Bogota': 'Bogota, Lima, Quito',
  'America/Caracas': 'Caracas, La Paz',
  'America/Santiago': 'Santiago',
  'America/St_Johns': 'Newfoundland and Labrador',
  'America/Sao_Paulo': 'Brasilia',
  'America/Tijuana': 'Tijuana, Pacific Time',
  'America/Argentina/Buenos_Aires': 'Buenos Aires, Georgetown',
  'America/Godthab': 'Greenland',
  'Atlantic/Azores': 'Azores',
  'Atlantic/Cape_Verde': 'Cape Verde Islands',
  GMT: 'UTC',
  'Europe/London': 'Edinburgh, London',
  'Europe/Dublin': 'Dublin',
  'Europe/Lisbon': 'Lisbon',
  'Africa/Casablanca': 'Casablanca, Monrovia',
  'Atlantic/Canary': 'Canary Islands',
  'Europe/Belgrade': 'Belgrade, Bratislava, Budapest, Ljubljana, Prague',
  'Europe/Sarajevo': 'Sarajevo, Skopje, Warsaw, Zagreb',
  'Europe/Brussels': 'Brussels, Copenhagen, Madrid, Paris',
  'Europe/Amsterdam': 'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
  'Africa/Algiers': 'West Central Africa',
  'Europe/Bucharest': 'Bucharest',
  'Africa/Cairo': 'Cairo',
  'Europe/Helsinki': 'Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius',
  'Europe/Athens': 'Athens, Istanbul, Minsk',
  'Asia/Jerusalem': 'Jerusalem',
  'Africa/Harare': 'Harare, Pretoria',
  'Europe/Moscow': 'Moscow, St. Petersburg, Volgograd',
  'Asia/Kuwait': 'Kuwait, Riyadh',
  'Africa/Nairobi': 'Nairobi',
  'Asia/Baghdad': 'Baghdad',
  'Asia/Tehran': 'Tehran',
  'Asia/Dubai': 'Abu Dhabi, Muscat',
  'Asia/Baku': 'Baku, Tbilisi, Yerevan',
  'Asia/Kabul': 'Kabul',
  'Asia/Yekaterinburg': 'Ekaterinburg',
  'Asia/Karachi': 'Islamabad, Karachi, Tashkent',
  'Asia/Kolkata': 'Chennai, Kolkata, Mumbai, New Delhi',
  'Asia/Kathmandu': 'Kathmandu',
  'Asia/Dhaka': 'Astana, Dhaka',
  'Asia/Colombo': 'Sri Jayawardenepura',
  'Asia/Almaty': 'Almaty, Novosibirsk',
  'Asia/Rangoon': 'Yangon Rangoon',
  'Asia/Bangkok': 'Bangkok, Hanoi, Jakarta',
  'Asia/Krasnoyarsk': 'Krasnoyarsk',
  'Asia/Shanghai': 'Beijing, Chongqing, Hong Kong SAR, Urumqi',
  'Asia/Kuala_Lumpur': 'Kuala Lumpur, Singapore',
  'Asia/Taipei': 'Taipei',
  'Australia/Perth': 'Perth',
  'Asia/Irkutsk': 'Irkutsk, Ulaanbaatar',
  'Asia/Seoul': 'Seoul',
  'Asia/Tokyo': 'Osaka, Sapporo, Tokyo',
  'Asia/Yakutsk': 'Yakutsk',
  'Australia/Darwin': 'Darwin',
  'Australia/Adelaide': 'Adelaide',
  'Australia/Sydney': 'Canberra, Melbourne, Sydney',
  'Australia/Brisbane': 'Brisbane',
  'Australia/Hobart': 'Hobart',
  'Asia/Vladivostok': 'Vladivostok',
  'Pacific/Guam': 'Guam, Port Moresby',
  'Asia/Magadan': 'Magadan, Solomon Islands, New Caledonia',
  'Asia/Kamchatka': 'Kamchatka, Marshall Islands',
  'Pacific/Fiji': 'Fiji Islands',
  'Pacific/Auckland': 'Auckland, Wellington',
  'Pacific/Tongatapu': "Nuku'alofa",
};

export type TimezoneType = {
  value: string;
  title: string;
  label: string;
  offset: number;
  abbrev: string;
  altName: string;
};

export const TimezoneOptions: TimezoneType[] = Object.entries(i18nTimezones)
  .map((zone) => {
    const now = spacetime.now().goto(zone[0]);
    const tz = now.timezone();
    const tzStrings = informal.display(zone[0]);

    let abbrev = zone[0];
    let altName = zone[0];

    if (tzStrings && tzStrings.standard) {
      abbrev =
        now.isDST() && tzStrings.daylight
          ? tzStrings.daylight.abbrev
          : tzStrings.standard.abbrev;
      altName =
        now.isDST() && tzStrings.daylight
          ? tzStrings.daylight.name
          : tzStrings.standard.name;
    }

    const min = tz.current.offset * 60;
    const hr = `${(min / 60) ^ 0}:${
      min % 60 === 0 ? '00' : Math.abs(min % 60)
    }`;
    const prefix = `(GMT${hr.includes('-') ? hr : `+${hr}`}) ${zone[1]}`;

    const label = `${prefix} ${abbrev.length < 5 ? `(${abbrev})` : ''}`;

    return {
      value: zone[0],
      title: zone[1],
      label,
      offset: tz.current.offset,
      abbrev,
      altName,
    };
  })
  .sort((a, b) => (a.offset < b.offset ? -1 : 1));

const selectStyles: Styles = {
  menu: (styles) => ({
    ...styles,
    background: theme.colors.dark,
  }),
  input: (styles) => ({
    ...styles,
    color: theme.colors.white,
  }),
  option: (styles) => ({
    ...styles,
    background: theme.colors.dark,
    ':hover': {
      backgroundColor: theme.colors.purpleTag,
      color: theme.colors.white,
    },
  }),
  control: (styles) => ({
    ...styles,
    background: theme.colors.dark,
    border: theme.colors.dark,
  }),
  singleValue: (styles) => ({
    ...styles,
    color: theme.colors.white,
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: theme.colors.white,
    cursor: 'pointer',
    ':hover': {
      color: theme.colors.blueLight,
    },
  }),
};

export const filterTimezones = (
  searchText: string,
  filteredTimezones: string[],
) => ({ value, title, label, abbrev, altName }: TimezoneType): boolean =>
  value.toLowerCase().includes(searchText) ||
  title.toLowerCase().includes(searchText) ||
  label.toLowerCase().includes(searchText) ||
  abbrev.toLowerCase().includes(searchText) ||
  altName.toLowerCase().includes(searchText) ||
  filteredTimezones.includes(value);

export const getTimezonesFor = (searchText: string): string[] =>
  cityTimezones
    .findFromCityStateProvince(searchText)
    .map(({ timezone }) => timezone);

export const SelectTimeZone: React.FC<TimezoneSelectProps> = ({ ...props }) => {
  const [options, setOptions] = useState(TimezoneOptions);

  const onInputChange = useCallback((value: string) => {
    if (!value) {
      setOptions(TimezoneOptions);
    } else {
      const searchText = value.toLowerCase().trim();
      const filteredTimezones = getTimezonesFor(searchText);
      setOptions(
        TimezoneOptions.filter(filterTimezones(searchText, filteredTimezones)),
      );
    }
  }, []);

  return (
    <TimezoneSelect
      styles={selectStyles}
      filterOption={null}
      onInputChange={onInputChange}
      timezones={options.reduce(
        (t, { value, title }) => ({ ...t, [value]: title }),
        {},
      )}
      {...props}
    />
  );
};
