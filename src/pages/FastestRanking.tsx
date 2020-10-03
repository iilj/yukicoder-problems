import React, { useEffect, useState } from 'react';
import { Ranking } from '../components/Ranking';
import * as TypedCachedApiClient from '../utils/TypedCachedApiClient';
import { UserName } from '../interfaces/User';
import { RankingProblem } from '../interfaces/RankingProblem';

const initialUniversalState = {
  speederMap: new Map<UserName, RankingProblem[]>(),
};

export const FastestRanking: React.FC = () => {
  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [universalStateLoaded, setUniversalStateLoaded] = useState(false);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      setUniversalStateLoaded(false);
      const speederMap = await TypedCachedApiClient.cachedSpeederMap();

      if (!unmounted) {
        setUniversalState({
          speederMap,
        });
        setUniversalStateLoaded(true);
      }
    };
    void getUniversalInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, []);

  const { speederMap } = universalState;

  const ranking = [] as { name: UserName; count: number }[];
  speederMap.forEach((rankingProblems, userName) => {
    ranking.push({ name: userName, count: rankingProblems.length });
  });

  return (
    <Ranking
      title="Fastest Submission Ranking"
      ranking={ranking}
      universalStateLoaded={universalStateLoaded}
    />
  );
};
