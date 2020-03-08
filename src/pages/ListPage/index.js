import React, { useState } from 'react';
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
} from 'reactstrap';
import { useParams } from 'react-router-dom';

import { DifficultyLevelTable } from './DifficultyLevelTable';
import { ListTable } from './ListTable';
import * as CachedApiClient from '../../utils/CachedApiClient';
import { WellPositionedDropdownMenu } from '../../components/WellPositionedDropdownMenu';
import { DifficultyStarsFillDefs, DifficultyStars } from '../../components/DifficultyStars';

const INF_LEVEL = 100;

export const ListPage = (props) => {
  const { param, user } = useParams();

  const [loadStarted, setLoadStarted] = useState(false);
  const [loadStartedParamUser, setLoadStartedParamUser] = useState({
    param: undefined,
    user: undefined,
  });
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);

  const [contestMap, setContestMap] = useState({});
  const [problemContestMap, setProblemContestMap] = useState({});
  const [solvedProblemsMap, setSolvedProblemsMap] = useState({});
  const [golferProblemMap, setGolferProblemMap] = useState({});
  const [golferPureProblemMap, setGolferPureProblemMap] = useState({});

  const [statusFilterState, setStatusFilterState] = useState('All');
  const [fromDifficultyLevel, setFromDifficultyLevel] = useState(-1);
  const [toDifficultyLevel, setToDifficultyLevel] = useState(INF_LEVEL);
  const [showTagsOfTryingProblems, setShowTagsOfTryingProblems] = useState(false);

  if (!loadStarted) {
    setLoadStarted(true);
    CachedApiClient.cachedProblemArray().then((ar) => setProblems(ar));
    CachedApiClient.cachedContestMap().then((map) => setContestMap(map));
    CachedApiClient.cachedGolferRankingProblemMap().then((map) => setGolferProblemMap(map));
    CachedApiClient.cachedGolferRankingPureProblemMap().then((map) => setGolferPureProblemMap(map));
  }
  if (problems.length > 0 && Object.keys(contestMap).length > 0) CachedApiClient.cachedProblemContestMap().then((map) => setProblemContestMap(map));

  if (param && user) {
    if (loadStartedParamUser.param !== param || loadStartedParamUser.user !== user) {
      setLoadStartedParamUser({ param, user });
      CachedApiClient.cachedSolvedProblemArray(param, user).then((ar) => setSolvedProblems(ar));
    }
    if (solvedProblems.length > 0) CachedApiClient.cachedSolvedProblemMap(param, user).then((map) => setSolvedProblemsMap(map));
  }

  const difficultyLevels = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];

  return (
    <>
      <DifficultyStarsFillDefs />

      <Row className="my-2 border-bottom">
        <h1>Level Status</h1>
      </Row>
      <Row>
        <DifficultyLevelTable problems={problems} solvedProblems={solvedProblems} user={user} />
      </Row>

      <Row className="my-2 border-bottom">
        <h1>Problem List</h1>
      </Row>
      <Row>
        <ButtonGroup className="mr-4">
          <UncontrolledDropdown>
            <DropdownToggle caret>{statusFilterState}</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => setStatusFilterState('All')}>All</DropdownItem>
              <DropdownItem onClick={() => setStatusFilterState('Only Trying')}>
                Only Trying
              </DropdownItem>
              <DropdownItem onClick={() => setStatusFilterState('Only AC')}>Only AC</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </ButtonGroup>

        <ButtonGroup className="mr-4">
          <UncontrolledButtonDropdown>
            <DropdownToggle caret>
              {fromDifficultyLevel === -1 ? 'Level From' : `${fromDifficultyLevel} - `}
            </DropdownToggle>
            <WellPositionedDropdownMenu>
              {difficultyLevels.map((level) => (
                <DropdownItem key={level} onClick={() => setFromDifficultyLevel(level)}>
                  <DifficultyStars level={level} showDifficultyLevel />
                  {level}
                  {' '}
                  -
                </DropdownItem>
              ))}
            </WellPositionedDropdownMenu>
          </UncontrolledButtonDropdown>
          <UncontrolledButtonDropdown>
            <DropdownToggle caret>
              {toDifficultyLevel === INF_LEVEL ? 'Level To' : ` - ${toDifficultyLevel}`}
            </DropdownToggle>
            <WellPositionedDropdownMenu>
              {difficultyLevels.map((level) => (
                <DropdownItem key={level} onClick={() => setToDifficultyLevel(level)}>
                  <DifficultyStars level={level} showDifficultyLevel />
                  -
                  {level}
                </DropdownItem>
              ))}
            </WellPositionedDropdownMenu>
          </UncontrolledButtonDropdown>
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
          }}
        >
          Reset
        </Button>
      </Row>
      <Row>
        <ListTable
          problems={problems}
          contestMap={contestMap}
          problemContestMap={problemContestMap}
          solvedProblemsMap={solvedProblemsMap}
          golferProblemMap={golferProblemMap}
          golferPureProblemMap={golferPureProblemMap}
          statusFilterState={statusFilterState}
          fromDifficultyLevel={fromDifficultyLevel}
          toDifficultyLevel={toDifficultyLevel}
          showTagsOfTryingProblems={showTagsOfTryingProblems}
        />
      </Row>
    </>
  );
};
