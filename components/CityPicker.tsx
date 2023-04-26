'use client';

import { GlobeIcon } from '@heroicons/react/solid';
import { City, Country } from 'country-state-city';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Select, { StylesConfig } from 'react-select';

type option = {
  value: {
    latitude: string;
    longitude: string;
    isoCode: string;
  };
  label: string;
} | null;

type cityOption = {
  value: {
    latitude: string;
    longitude: string;
    countryCode: string;
    name: string;
    stateCode: string;
  };
  label: string;
} | null;

const options = Country.getAllCountries().map((country) => ({
  value: {
    latitude: country.latitude,
    longitude: country.longitude,
    isoCode: country.isoCode,
  },
  label: country.name,
}));

const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colourStyles: StylesConfig<ColourOption> = {
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = '#394F68';
    return {
      ...styles,
      backgroundColor: isDisabled ? undefined : isSelected ? color : isFocused ? color : undefined,
      color: isSelected ? 'white' : isFocused ? 'white' : 'black',
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled ? (isSelected ? data.color : color) : undefined,
      },
    };
  },
};

function CityPicker() {
  const [selectedCountry, setSelectedCountry] = useState<option>(null);
  const [selectedCity, setSelectedCity] = useState<cityOption>(null);
  const router = useRouter();

  const handleSelectedCountry = (option: option) => {
    setSelectedCountry(option);
    setSelectedCity(null);
  };

  const handleSelectedCity = (option: cityOption) => {
    setSelectedCity(option);
    router.push(`/location/${option?.value?.name}/${option?.value?.latitude}/${option?.value?.longitude}`);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-white/80">
          <GlobeIcon className="h-5 w-5 text-white" />
          <label htmlFor="country">Country</label>
        </div>
        <Select value={selectedCountry} onChange={handleSelectedCountry} options={options} styles={colourStyles} />
      </div>

      {selectedCountry && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-white/80 ">
            <GlobeIcon className="h-5 w-5 text-white" />
            <label htmlFor="country">City</label>
          </div>
          <Select
            value={selectedCity}
            onChange={handleSelectedCity}
            options={
              City.getCitiesOfCountry(selectedCountry?.value?.isoCode)?.map((state) => ({
                value: {
                  latitude: state.latitude,
                  longitude: state.longitude,
                  countryCode: state.countryCode,
                  name: state.name,
                  stateCode: state.stateCode,
                },
                label: state.name,
              })) || []
            }
            styles={colourStyles}
          />
        </div>
      )}
    </div>
  );
}

export default CityPicker;
