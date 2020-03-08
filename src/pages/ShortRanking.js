import React, { useState } from 'react';
import { Ranking } from '../components/Ranking';
import * as CachedApiClient from '../utils/CachedApiClient';

export const ShortRanking = () => {
  const [golferMap, setGolferMap] = useState({});
  CachedApiClient.cachedGolferMap().then((map) => setGolferMap(map));

  const ranking = Object.keys(golferMap).reduce((ar, userName) => {
    ar.push({ name: userName, count: golferMap[userName].length });
    return ar;
  }, []);

  return <Ranking title="Top Golfers" ranking={ranking} />;
};
