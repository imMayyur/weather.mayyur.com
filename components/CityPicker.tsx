'use client';

import { GlobeIcon } from '@heroicons/react/solid';
import { City, Country } from 'country-state-city';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Select from 'react-select';

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
    latitude: string | null | undefined;
    longitude: string | null | undefined;
    countryCode: string | null | undefined;
    name: string | null | undefined;
    stateCode: string | null | undefined;
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
        <Select
          value={selectedCountry}
          onChange={handleSelectedCountry}
          options={options}
          styles={{
            option: (option, { isDisabled, isFocused, isSelected }) => ({
              ...option,
              backgroundColor: isDisabled ? undefined : isSelected ? '#394F68' : isFocused ? '#394F68' : undefined,
              color: isSelected ? 'white' : isFocused ? 'white' : 'black',
            }),
          }}
        />
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
            styles={{
              option: (option, { isDisabled, isFocused, isSelected }) => ({
                ...option,
                backgroundColor: isDisabled ? undefined : isSelected ? '#394F68' : isFocused ? '#394F68' : undefined,
                color: isSelected ? 'white' : isFocused ? 'white' : 'black',
              }),
            }}
            options={
              City?.getCitiesOfCountry(selectedCountry?.value?.isoCode)?.map((city) => ({
                value: {
                  latitude: city.latitude,
                  longitude: city.longitude,
                  countryCode: city.countryCode,
                  name: city.name,
                  stateCode: city.stateCode,
                },
                label: city.name,
              })) || []
            }
          />
        </div>
      )}
    </div>
  );
}

export default CityPicker;
