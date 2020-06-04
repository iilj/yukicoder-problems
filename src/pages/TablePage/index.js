import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Row, FormGroup, Label, Input,
} from 'reactstrap';

import { YukicoderRegularTable } from './YukicoderRegularTable';
import { ContestTable } from './ContestTable';
import { AllProblemsTable } from './AllProblemsTable';
import { TableTabButtons } from './TableTab';
import { useLocalStorage } from '../../utils/LocalStorage';
import * as CachedApiClient from '../../utils/CachedApiClient';
import { DifficultyStarsFillDefs } from '../../components/DifficultyStars';

/**
 * Wrap element to switch visibility.
 *
 * @param {{display: boolean, children: any}} props
 * @returns {JSX.Element} wrapped element
 */
const ContestWrapper = (props) => (
  <div style={{ display: props.display ? '' : 'none' }}>{props.children}</div>
);

/**
 * @type {{contests: {Id: number, Name: string, Date: string, EndDate: string, ProblemIdList: number[]}[], problemsMap: any}}
 */
const initialUniversalState = {
  contests: [],
  contestMap: {},
  problemsMap: {},
  problemContestMap: {},
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
      const [contestMap, problemContestMap] = await Promise.all([
        CachedApiClient.cachedContestMap(),
        CachedApiClient.cachedProblemContestMap(),
      ]);

      if (!unmounted) {
        setUniversalState({
          contests,
          contestMap,
          problemsMap,
          problemContestMap,
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

  const {
    contests, contestMap, problemsMap, problemContestMap,
  } = universalState;
  const { solvedProblemsMap } = userState;

  const [showDifficultyLevel, setShowDifficultyLevel] = useLocalStorage(
    'TablePage_showDifficultyLevel',
    true,
  );
  const [showContestResult, setShowContestResult] = useLocalStorage(
    'TablePage_showContestResult',
    true,
  );
  const [activeTab, setActiveTab] = useLocalStorage('TablePage_activeTab', 0);

  const yukicoderRegularContests = [];
  const yukicoderLongContests = [];
  const otherContests = [];
  contests.forEach((contest) => {
    if (contest.Name.match(/^yukicoder contest \d+/)) {
      if (contest.ProblemIdList.length <= 6) yukicoderRegularContests.push(contest);
      else yukicoderLongContests.push(contest);
    } else otherContests.push(contest);
  });

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
      <ContestWrapper display={activeTab === 3}>
        <AllProblemsTable
          contestMap={contestMap}
          problemContestMap={problemContestMap}
          title="All Problems"
          problemsMap={problemsMap}
          solvedProblemsMap={solvedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
        />
      </ContestWrapper>
    </>
  );
};
