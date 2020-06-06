import React, { useEffect, useState } from 'react';
import { Ranking } from '../components/Ranking';
import * as CachedApiClient from '../utils/CachedApiClient';

const initialUniversalState = {
  golferMap: {},
};

export const ShortRanking = () => {
  const [universalState, setUniversalState] = useState(initialUniversalState);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      const golferMap = await CachedApiClient.cachedGolferMap();

      if (!unmounted) {
        setUniversalState({
          golferMap,
        });
      }
    };
    getUniversalInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [setUniversalState]);

  const { golferMap } = universalState;

  const ranking = Object.keys(golferMap).reduce((ar, userName) => {
    ar.push({ name: userName, count: golferMap[userName].length });
    return ar;
  }, []);

  return <Ranking title="Top Golfers" ranking={ranking} />;
};
