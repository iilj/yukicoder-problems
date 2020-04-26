import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Row, FormGroup, Label, Input,
} from 'reactstrap';

import { YukicoderRegularTable } from './YukicoderRegularTable';
import { ContestTable } from './ContestTable';
import { TableTabButtons } from './TableTab';
import * as CachedApiClient from '../../utils/CachedApiClient';
import { DifficultyStarsFillDefs } from '../../components/DifficultyStars';

const ContestWrapper = (props) => (
  <div style={{ display: props.display ? '' : 'none' }}>{props.children}</div>
);

const initialUniversalState = {
  contests: [],
  problemsMap: {},
};

const initialUserState = {
  solvedProblemsMap: {},
};

export const TablePage = (props) => {
  let { param, user } = useParams();
  if (user) user = decodeURIComponent(user);

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [userState, setUserState] = useState(initialUserState);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      const [contests, problemsMap] = await Promise.all([
        CachedApiClient.cachedContestArray(),
        CachedApiClient.cachedProblemMap(),
      ]);

      if (!unmounted) {
        setUniversalState({
          contests,
          problemsMap,
        });
      }
    };
    getUniversalInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [setUniversalState]);

  useEffect(() => {
    let unmounted = false;
    const getUserInfo = async () => {
      const solvedProblemsMap = param && user ? await CachedApiClient.cachedSolvedProblemMap(param, user) : {};

      if (!unmounted) {
        setUserState({
          solvedProblemsMap,
        });
      }
    };
    getUserInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [param, user, setUserState]);

  const { contests, problemsMap } = universalState;
  const { solvedProblemsMap } = userState;

  const [showDifficultyLevel, setShowDifficultyLevel] = useState(true);
  const [showContestResult, setShowContestResult] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const yukicoderRegularContests = [];
  const yukicoderLongContests = [];
  const otherContests = [];
  contests.forEach((contest) => {
    if (contest.Name.match(/^yukicoder contest \d+/)) {
      if (contest.ProblemIdList.length <= 6) yukicoderRegularContests.push(contest);
      else yukicoderLongContests.push(contest);
    } else otherContests.push(contest);
  });
  console.log(user);
  console.log(solvedProblemsMap);

  return (
    <>
      <Row className="my-4">
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              checked={showDifficultyLevel}
              onChange={(e) => setShowDifficultyLevel(e.target.checked)}
            />
            Show Difficulty Level
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              checked={showContestResult}
              onChange={(e) => setShowContestResult(e.target.checked)}
            />
            Show Contest Result
          </Label>
        </FormGroup>
      </Row>
      <TableTabButtons active={activeTab} setActive={setActiveTab} />
      <DifficultyStarsFillDefs />
      <ContestWrapper display={activeTab === 0}>
        <YukicoderRegularTable
          contests={yukicoderRegularContests}
          title="yukicoder contest (regular)"
          problemsMap={problemsMap}
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === 1}>
        <ContestTable
          contests={yukicoderLongContests}
          title="yukicoder contest (long)"
          problemsMap={problemsMap}
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === 2}>
        <ContestTable
          contests={otherContests}
          title="Other contests"
          problemsMap={problemsMap}
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
        />
      </ContestWrapper>
    </>
  );
};
