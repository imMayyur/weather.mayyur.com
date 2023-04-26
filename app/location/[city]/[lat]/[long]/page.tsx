import { getClient } from '@/apollo-client';
import CalloutCard from '@/components/CalloutCard';
import HumidityChart from '@/components/HumidityChart';
import InformationPanel from '@/components/InformationPanel';
import RainChart from '@/components/RainChart';
import StatCard from '@/components/StatCard';
import TempChart from '@/components/TempChart';
import fetchWeatherQuery from '@/graphql/queries/fetchWeatherQueries';
import cleanData from '@/lib/cleanData';

import getBasePath from '@/lib/getBasePath';
import moment from 'moment';

export const revalidate = 60;

type Props = {
  params: {
    city: string;
    lat: string;
    long: string;
  };
};

async function WeatherPage({ params: { city, lat, long } }: Props) {
  const client = getClient();
  const { data } = await client.query({
    query: fetchWeatherQuery,
    variables: {
      current_weather: 'true',
      longitude: long,
      latitude: lat,
      timezone: 'IST',
    },
  });

  const results: Root = data.myQuery;

  const dataToSend = cleanData(results, city);

  if (!dataToSend) return <div>Something went wrong</div>;
  const res = await fetch(`${getBasePath()}/api/getWeatherSummary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      weatherData: dataToSend,
    }),
  });

  const GPTdata = (await res?.json()) || {
    content: 'No content found',
  };
  const { content } = GPTdata;

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <InformationPanel city={city} lat={lat} long={long} results={results} />
      <div className="flex-1 p-5 lg:p-10">
        <div className="p-5">
          <div className="pb-5">
            <h2 className="text-xl font-bold">Todays Overwiew</h2>
            <p className="text-sm text-gray-400">
              Last Updated at: {moment(results.current_weather.time.toString()).format('MMMM Do YYYY, h:mm:ss A')} (
              {moment(results.current_weather.time.toString()).fromNow()})
            </p>
          </div>
          <div className="m-2 mb-10">
            <CalloutCard message={content} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 m-2">
            <StatCard
              title="Maximum Temperature"
              metric={`${results.daily.temperature_2m_max[0].toFixed(1)}°C`}
              color="yellow"
            />
            <StatCard
              title="Minimum Temperature"
              metric={`${results.daily.temperature_2m_min[0].toFixed(1)}°C`}
              color="green"
            />
            <div className="space-y-3">
              <StatCard title="UV Index" metric={results.daily.uv_index_max[0].toFixed(1)} color="rose" />
              {Number(results.daily.uv_index_max[0].toFixed(1)) > 5 && (
                <CalloutCard
                  message="Warning: UV Index is high today. Please wear sunscreen and avoid direct sunlight."
                  warning
                />
              )}
            </div>
            <div className="flex space-x-3">
              <StatCard title="Wind Speed" metric={`${results.current_weather.windspeed.toFixed(1)}m/s`} color="cyan" />
              <StatCard
                title="Wind Direction"
                metric={`${results.current_weather.winddirection.toFixed(1)}°`}
                color="violet"
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="space-y-3">
          <TempChart results={results} />
          <HumidityChart results={results} />
          <RainChart results={results} />
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;
