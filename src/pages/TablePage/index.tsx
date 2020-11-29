import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Row,
  FormGroup,
  Label,
  Input,
  Spinner,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { YukicoderRegularTable } from './YukicoderRegularTable';
import { ContestTable } from './ContestTable';
import { AllProblemsTable } from './AllProblemsTable';
import { TableTabButtons, ContestTableTab } from './TableTab';
import { useLocalStorage } from '../../utils/LocalStorage';
import * as TypedCachedApiClient from '../../utils/TypedCachedApiClient';
import * as DifficultyDataClient from '../../utils/DifficultyDataClient';
import { mergeSolveStatus, mergedProblemsToMap } from '../../utils/MergeProcs';
import { DifficultyStarsFillDefs } from '../../components/DifficultyStars';
import { Contest, ContestId } from '../../interfaces/Contest';
import { Problem, ProblemId } from '../../interfaces/Problem';
import {
  SolvedProblem,
  FirstSolvedProblem,
} from '../../interfaces/SolvedProblem';
import { MergedProblem } from '../../interfaces/MergedProblem';
import { Difficulties } from '../../interfaces/Difficulty';
import { ProblemLinkColorMode } from '../../components/ProblemLink';

/**
 * Wrap element to switch visibility.
 */
const ContestWrapper: React.FC<{
  display: boolean;
}> = (props) => <>{props.display ? props.children : <></>}</>;

const initialUniversalState = {
  problems: [] as Problem[],
  contests: [] as Contest[],
  contestMap: new Map<ContestId, Contest>(),
  problemContestMap: new Map<ProblemId, ContestId>(),
  difficulties: {} as Difficulties,
};

const initialUserState = {
  solvedProblemsMap: new Map<ProblemId, SolvedProblem>(),
  firstSolvedProblemsMap: new Map<ProblemId, FirstSolvedProblem>(),
};

const initialMergedState = {
  mergedProblems: [] as MergedProblem[],
  mergedProblemsMap: new Map<ProblemId, MergedProblem>(),
};

export const TablePage: React.FC = () => {
  const { param, user } = useParams() as {
    param: TypedCachedApiClient.UserParam;
    user: string;
  };

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [userState, setUserState] = useState(initialUserState);
  const [mergedState, setMergedState] = useState(initialMergedState);
  const [universalStateLoaded, setUniversalStateLoaded] = useState(false);
  const [userStateLoaded, setUserStateLoaded] = useState(false);
  const [mergedStateLoaded, setMergedStateLoaded] = useState(false);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      setUniversalStateLoaded(false);
      const [problems, contests, difficulties] = await Promise.all([
        TypedCachedApiClient.cachedProblemArray(),
        TypedCachedApiClient.cachedContestArray(),
        DifficultyDataClient.cachedDifficultyData(),
      ]);
      const [contestMap, problemContestMap] = await Promise.all([
        TypedCachedApiClient.cachedContestMap(),
        TypedCachedApiClient.cachedProblemContestMap(),
      ]);

      if (!unmounted) {
        setUniversalState({
          problems,
          contests,
          contestMap,
          problemContestMap,
          difficulties,
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

  useEffect(() => {
    let unmounted = false;
    const getUserInfo = async () => {
      setUserStateLoaded(false);
      const [solvedProblemsMap, firstSolvedProblemsMap] =
        param && user
          ? await Promise.all([
              TypedCachedApiClient.cachedSolvedProblemMap(param, user),
              TypedCachedApiClient.cachedFirstSolvedProblemMap(param, user),
            ])
          : [
              new Map<ProblemId, SolvedProblem>(),
              new Map<ProblemId, FirstSolvedProblem>(),
            ];

      if (!unmounted) {
        setUserState({
          solvedProblemsMap,
          firstSolvedProblemsMap,
        });
        setUserStateLoaded(true);
      }
    };
    void getUserInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [param, user]);

  useEffect(() => {
    let unmounted = false;
    const getMergedInfo = () => {
      setMergedStateLoaded(false);
      const mergedProblems = mergeSolveStatus(
        universalState.problems,
        universalState.contests,
        universalState.problemContestMap,
        userState.solvedProblemsMap,
        userState.firstSolvedProblemsMap,
        universalState.difficulties
      );
      const mergedProblemsMap = mergedProblemsToMap(mergedProblems);

      if (!unmounted) {
        setMergedState({
          mergedProblems,
          mergedProblemsMap,
        });
        setMergedStateLoaded(true);
      }
    };
    void getMergedInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [universalState, userState]);

  const { contests } = universalState;
  const { mergedProblems, mergedProblemsMap } = mergedState;

  const [colorMode, setColorMode] = useLocalStorage<ProblemLinkColorMode>(
    'TablePage_colorMode',
    'Level'
  );
  const [showDifficultyLevel, setShowDifficultyLevel] = useLocalStorage(
    'TablePage_showDifficultyLevel',
    true
  );
  const [showContestResult, setShowContestResult] = useLocalStorage(
    'TablePage_showContestResult',
    true
  );
  const [showContestDate, setShowContestDate] = useLocalStorage(
    'TablePage_showContestDate',
    false
  );
  const [activeTab, setActiveTab] = useLocalStorage(
    'TablePage_activeTab',
    ContestTableTab.regular
  );

  const yukicoderRegularContests = [] as Contest[];
  const yukicoderLongContests = [] as Contest[];
  const otherContests = [] as Contest[];
  const otherProblems = [] as Contest[];
  const regexpYukicoderContest = /^yukicoder contest \d+/;
  const regexpOpenContest = /\(Open\)$/;
  contests.forEach((contest) => {
    if (regexpYukicoderContest.exec(contest.Name)) {
      if (contest.ProblemIdList.length <= 7)
        yukicoderRegularContests.push(contest);
      else yukicoderLongContests.push(contest);
    } else if (regexpOpenContest.exec(contest.Name)) {
      otherProblems.push(contest);
    } else otherContests.push(contest);
  });

  // filter sigle problems
  otherProblems.push({
    Id: -1,
    Name: 'Others',
    Date: '',
    EndDate: '',
    ProblemIdList: mergedProblems.reduce((ar, mergedProblem) => {
      if (!mergedProblem.Contest) ar.push(mergedProblem.ProblemId);
      return ar;
    }, [] as ProblemId[]),
  } as Contest);

  return (
    <>
      {userStateLoaded && mergedStateLoaded ? (
        <></>
      ) : (
        <Spinner
          style={{
            width: '3rem',
            height: '3rem',
            position: 'fixed',
            right: '10px',
            bottom: '10px',
          }}
        />
      )}
      <Row className="my-4">
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
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              checked={showDifficultyLevel}
              onChange={(e) => setShowDifficultyLevel(e.target.checked)}
            />
            Show Level Stars
          </Label>
        </FormGroup>
        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              checked={showContestDate}
              onChange={(e) => setShowContestDate(e.target.checked)}
            />
            Show Contest Date
          </Label>
        </FormGroup>
        <UncontrolledDropdown>
          <DropdownToggle caret>
            {
              {
                None: 'Color By',
                Level: 'Level',
                Difficulty: 'Difficulty (experimental)',
              }[colorMode]
            }
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Color By</DropdownItem>
            <DropdownItem onClick={(): void => setColorMode('None')}>
              None
            </DropdownItem>
            <DropdownItem onClick={(): void => setColorMode('Level')}>
              Level
            </DropdownItem>
            <DropdownItem onClick={(): void => setColorMode('Difficulty')}>
              Difficulty (experimental)
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Row>
      <TableTabButtons active={activeTab} setActive={setActiveTab} />
      <DifficultyStarsFillDefs />
      <ContestWrapper display={activeTab === ContestTableTab.regular}>
        <YukicoderRegularTable
          contests={yukicoderRegularContests}
          title="yukicoder contest (regular)"
          mergedProblemsMap={mergedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          problemLinkColorMode={colorMode}
          showContestResult={showContestResult}
          showContestDate={showContestDate}
          universalStateLoaded={universalStateLoaded}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === ContestTableTab.long}>
        <ContestTable
          contests={yukicoderLongContests}
          title="yukicoder contest (long)"
          mergedProblemsMap={mergedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          problemLinkColorMode={colorMode}
          showContestResult={showContestResult}
          showContestDate={showContestDate}
          universalStateLoaded={universalStateLoaded}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === ContestTableTab.other}>
        <ContestTable
          contests={otherContests}
          title="Other Contests"
          mergedProblemsMap={mergedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          problemLinkColorMode={colorMode}
          showContestResult={showContestResult}
          showContestDate={showContestDate}
          universalStateLoaded={universalStateLoaded}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === ContestTableTab.other_problems}>
        <ContestTable
          contests={otherProblems}
          title="Other Problems"
          mergedProblemsMap={mergedProblemsMap}
          showDifficultyLevel={showDifficultyLevel}
          problemLinkColorMode={colorMode}
          showContestResult={showContestResult}
          showContestDate={showContestDate}
          universalStateLoaded={universalStateLoaded}
        />
      </ContestWrapper>
      <ContestWrapper display={activeTab === ContestTableTab.all}>
        <AllProblemsTable
          mergedProblems={mergedProblems}
          title="All Problems"
          problemLinkColorMode={colorMode}
          showDifficultyLevel={showDifficultyLevel}
          showContestResult={showContestResult}
          universalStateLoaded={universalStateLoaded}
        />
      </ContestWrapper>
    </>
  );
};
