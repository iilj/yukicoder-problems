import React, { useEffect, useState } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledButtonDropdown,
  UncontrolledDropdown,
  Button,
  ButtonGroup,
  FormGroup,
  Label,
  Input,
  Spinner,
} from 'reactstrap';
import { useParams } from 'react-router-dom';

import { DifficultyLevelTable } from './DifficultyLevelTable';
import { ProblemTypeTable } from './ProblemTypeTable';
import { ListTable, FilterState } from './ListTable';
import { getProblemTypeName } from '../../utils';
import * as TypedCachedApiClient from '../../utils/TypedCachedApiClient';
import * as DifficultyDataClient from '../../utils/DifficultyDataClient';
import { mergeSolveStatus, mergeShortest } from '../../utils/MergeProcs';
import { WellPositionedDropdownMenu } from '../../components/WellPositionedDropdownMenu';
import {
  DifficultyStarsFillDefs,
  DifficultyStars,
} from '../../components/DifficultyStars';
import {
  DateRangePicker,
  INITIAL_FROM_DATE,
  INITIAL_TO_DATE,
} from '../../components/DateRangePicker';
import { ProblemTypeIconSpanWithName } from '../../components/ProblemTypeIcon';
import {
  Problem,
  ProblemNo,
  ProblemId,
  ProblemType,
  ProblemLevel,
  ProblemLevels,
} from '../../interfaces/Problem';
import {
  SolvedProblem,
  FirstSolvedProblem,
} from '../../interfaces/SolvedProblem';
import { Contest, ContestId } from '../../interfaces/Contest';
import { RankingProblem } from '../../interfaces/RankingProblem';
import { RankingMergedProblem } from '../../interfaces/MergedProblem';
import { Difficulties } from '../../interfaces/Difficulty';
import { ProblemLinkColorMode } from '../../components/ProblemLink';
import { useLocalStorage } from '../../utils/LocalStorage';

const INF_LEVEL = 100;

const initialUniversalState = {
  problems: [] as Problem[],
  contests: [] as Contest[],
  problemContestMap: new Map<ProblemId, ContestId>(),
  golferProblemMap: new Map<ProblemNo, RankingProblem>(),
  golferPureProblemMap: new Map<ProblemNo, RankingProblem>(),
  difficulties: {} as Difficulties,
};

const initialUserState = {
  solvedProblems: [] as SolvedProblem[],
  solvedProblemsMap: new Map<ProblemId, SolvedProblem>(),
  firstSolvedProblems: [] as FirstSolvedProblem[],
  firstSolvedProblemsMap: new Map<ProblemId, FirstSolvedProblem>(),
};

const initialMergedState = {
  rankingMergedProblems: [] as RankingMergedProblem[],
};

export const ListPage: React.FC = () => {
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
      const [
        problems,
        contests,
        golferProblemMap,
        golferPureProblemMap,
        difficulties,
      ] = await Promise.all([
        TypedCachedApiClient.cachedProblemArray(),
        TypedCachedApiClient.cachedContestArray(),
        TypedCachedApiClient.cachedGolferRankingProblemMap(),
        TypedCachedApiClient.cachedGolferRankingPureProblemMap(),
        DifficultyDataClient.cachedDifficultyData(),
      ]);
      const problemContestMap = await TypedCachedApiClient.cachedProblemContestMap();

      if (!unmounted) {
        setUniversalState({
          problems,
          contests,
          problemContestMap,
          golferProblemMap,
          golferPureProblemMap,
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
      const [solvedProblems, firstSolvedProblems] =
        param && user
          ? await Promise.all([
              TypedCachedApiClient.cachedSolvedProblemArray(param, user),
              TypedCachedApiClient.cachedFirstSolvedProblemArray(param, user),
            ])
          : [[] as SolvedProblem[], [] as FirstSolvedProblem[]];
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
          solvedProblems,
          solvedProblemsMap,
          firstSolvedProblems,
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
      const rankingMergedProblems = mergeShortest(
        mergedProblems,
        universalState.golferProblemMap,
        universalState.golferPureProblemMap
      );

      if (!unmounted) {
        setMergedState({
          rankingMergedProblems,
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

  const { problems } = universalState;
  const { firstSolvedProblems } = userState;
  const { rankingMergedProblems } = mergedState;

  const [colorMode, setColorMode] = useLocalStorage<ProblemLinkColorMode>(
    'TablePage_colorMode',
    'Level'
  );

  const [statusFilterState, setStatusFilterState] = useState<FilterState>(
    'All'
  );
  const [fromDifficultyLevel, setFromDifficultyLevel] = useState<
    ProblemLevel | -1
  >(-1);
  const [toDifficultyLevel, setToDifficultyLevel] = useState<
    ProblemLevel | 100
  >(INF_LEVEL);
  const [showTagsOfTryingProblems, setShowTagsOfTryingProblems] = useState(
    false
  );
  const [fromDate, setFromDate] = useState(INITIAL_FROM_DATE);
  const [toDate, setToDate] = useState(INITIAL_TO_DATE);
  const [problemTypeFilterState, setProblemTypeFilterState] = useState<
    ProblemType | 'All'
  >('All');

  return (
    <>
      <DifficultyStarsFillDefs />

      {universalStateLoaded && userStateLoaded && mergedStateLoaded ? (
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

      <Row className="my-2 border-bottom">
        <h2>Level Status</h2>
      </Row>
      <Row>
        <DifficultyLevelTable
          problems={problems}
          firstSolvedProblems={firstSolvedProblems}
          user={user}
          problemLinkColorMode={colorMode}
        />
      </Row>

      <Row className="my-2 border-bottom">
        <h2>Type Status</h2>
      </Row>
      <Row>
        <ProblemTypeTable
          problems={problems}
          firstSolvedProblems={firstSolvedProblems}
          user={user}
        />
      </Row>

      <Row className="my-2 border-bottom">
        <h2>Problem List</h2>
      </Row>
      <Row>
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
      <Row>
        <ButtonGroup className="mr-4">
          <UncontrolledDropdown>
            <DropdownToggle caret>{statusFilterState}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setStatusFilterState('All')}>
                All
              </DropdownItem>
              <DropdownItem onClick={() => setStatusFilterState('Only Trying')}>
                Only Trying
              </DropdownItem>
              <DropdownItem onClick={() => setStatusFilterState('Only AC')}>
                Only AC
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </ButtonGroup>

        <ButtonGroup className="mr-4">
          <UncontrolledButtonDropdown>
            <DropdownToggle caret>
              {fromDifficultyLevel === -1
                ? 'Level From'
                : `${fromDifficultyLevel} - `}
            </DropdownToggle>
            <WellPositionedDropdownMenu>
              {ProblemLevels.map((level) => (
                <DropdownItem
                  key={level}
                  onClick={() => setFromDifficultyLevel(level)}
                >
                  <DifficultyStars
                    level={level}
                    showDifficultyLevel={true}
                    color={colorMode === 'Level'}
                  />
                  {level.toFixed(1)} -
                </DropdownItem>
              ))}
            </WellPositionedDropdownMenu>
          </UncontrolledButtonDropdown>
          <UncontrolledButtonDropdown>
            <DropdownToggle caret>
              {toDifficultyLevel === INF_LEVEL
                ? 'Level To'
                : ` - ${toDifficultyLevel}`}
            </DropdownToggle>
            <WellPositionedDropdownMenu>
              {ProblemLevels.map((level) => (
                <DropdownItem
                  key={level}
                  onClick={() => setToDifficultyLevel(level)}
                >
                  <DifficultyStars
                    level={level}
                    showDifficultyLevel={true}
                    color={colorMode === 'Level'}
                  />
                  -{level.toFixed(1)}
                </DropdownItem>
              ))}
            </WellPositionedDropdownMenu>
          </UncontrolledButtonDropdown>
        </ButtonGroup>

        <DateRangePicker
          minDate={INITIAL_FROM_DATE}
          maxDate={INITIAL_TO_DATE}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={(date: Date) => {
            setFromDate(date);
          }}
          onToDateChange={(date: Date) => {
            setToDate(date);
          }}
        />

        <ButtonGroup className="mr-4">
          <UncontrolledDropdown>
            <DropdownToggle caret>
              {problemTypeFilterState === 'All'
                ? 'All'
                : getProblemTypeName(problemTypeFilterState)}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setProblemTypeFilterState('All')}>
                All
              </DropdownItem>
              <DropdownItem
                onClick={() => setProblemTypeFilterState(ProblemType.Normal)}
              >
                <ProblemTypeIconSpanWithName problemType={ProblemType.Normal} />
              </DropdownItem>
              <DropdownItem
                onClick={() =>
                  setProblemTypeFilterState(ProblemType.Educational)
                }
              >
                <ProblemTypeIconSpanWithName
                  problemType={ProblemType.Educational}
                />
              </DropdownItem>
              <DropdownItem
                onClick={() => setProblemTypeFilterState(ProblemType.Scoring)}
              >
                <ProblemTypeIconSpanWithName
                  problemType={ProblemType.Scoring}
                />
              </DropdownItem>
              <DropdownItem
                onClick={() => setProblemTypeFilterState(ProblemType.Joke)}
              >
                <ProblemTypeIconSpanWithName problemType={ProblemType.Joke} />
              </DropdownItem>
              <DropdownItem
                onClick={() => setProblemTypeFilterState(ProblemType.Unproved)}
              >
                <ProblemTypeIconSpanWithName
                  problemType={ProblemType.Unproved}
                />
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </ButtonGroup>

        <FormGroup check inline>
          <Label check>
            <Input
              type="checkbox"
              checked={showTagsOfTryingProblems}
              onChange={(e) => setShowTagsOfTryingProblems(e.target.checked)}
            />
            Show Tags of Trying Problems
          </Label>
        </FormGroup>

        <Button
          outline
          color="danger"
          onClick={() => {
            setStatusFilterState('All');
            setFromDifficultyLevel(-1);
            setToDifficultyLevel(INF_LEVEL);
            setShowTagsOfTryingProblems(false);
            setFromDate(INITIAL_FROM_DATE);
            setToDate(INITIAL_TO_DATE);
          }}
        >
          Reset
        </Button>
      </Row>
      <Row>
        <ListTable
          rankingMergedProblems={rankingMergedProblems}
          statusFilterState={statusFilterState}
          fromDifficultyLevel={fromDifficultyLevel}
          toDifficultyLevel={toDifficultyLevel}
          fromDate={fromDate === INITIAL_FROM_DATE ? undefined : fromDate}
          toDate={toDate === INITIAL_TO_DATE ? undefined : toDate}
          problemTypeFilterState={problemTypeFilterState}
          showTagsOfTryingProblems={showTagsOfTryingProblems}
          problemLinkColorMode={colorMode}
        />
      </Row>
    </>
  );
};
