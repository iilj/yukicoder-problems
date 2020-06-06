import React, { useEffect, useState } from 'react';
import { Ranking } from '../components/Ranking';
import * as TypedCachedApiClient from '../utils/TypedCachedApiClient';
import { UserName } from '../interfaces/User';
import { RankingProblem } from '../interfaces/RankingProblem';

const initialUniversalState = {
  golferMap: new Map<UserName, RankingProblem[]>(),
};

export const ShortRanking = () => {
  const [universalState, setUniversalState] = useState(initialUniversalState);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      const golferMap = await TypedCachedApiClient.cachedGolferMap();

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

  const ranking = [] as { name: UserName; count: number }[];
  golferMap.forEach((rankingProblems, userName) => {
    ranking.push({ name: userName, count: rankingProblems.length });
  });

  return <Ranking title="Top Golfers" ranking={ranking} />;
};
