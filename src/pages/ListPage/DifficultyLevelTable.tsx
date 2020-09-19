import React, { useState } from 'react';
import Table from 'reactstrap/lib/Table';
import { Button, FormGroup, ButtonGroup } from 'reactstrap';
import { DifficultyStarsAbsoluteSpan } from '../../components/DifficultyStars';
import { ProblemTypeIcon } from '../../components/ProblemTypeIcon';
import { getDifficultyLevelColorClass } from '../../utils';
import {
  Problem,
  ProblemLevels,
  ProblemLevel,
  ProblemType,
} from '../../interfaces/Problem';
import { SolvedProblem } from '../../interfaces/SolvedProblem';
import { ProblemLinkColorMode } from '../../components/ProblemLink';

interface Props {
  problems: Problem[];
  solvedProblems: SolvedProblem[];
  user: string;
  problemLinkColorMode: ProblemLinkColorMode;
}

export const DifficultyLevelTable: React.FC<Props> = (props) => {
  const { problems, solvedProblems, user, problemLinkColorMode } = props;
  const [includingEducational, setIncludingEducational] = useState(true);
  const [includingScoring, setIncludingScoring] = useState(true);
  const [includingJoke, setIncludingJoke] = useState(true);
  const [includingUnproved, setIncludingUnproved] = useState(true);

  const difficultyLevelsSolvedCountMap = solvedProblems.reduce(
    (map, solvedProblem) =>
      solvedProblem.ProblemType === ProblemType.Normal ||
      (solvedProblem.ProblemType === ProblemType.Educational &&
        includingEducational) ||
      (solvedProblem.ProblemType === ProblemType.Scoring && includingScoring) ||
      (solvedProblem.ProblemType === ProblemType.Joke && includingJoke) ||
      (solvedProblem.ProblemType === ProblemType.Unproved && includingUnproved)
        ? map.set(
            solvedProblem.Level,
            (map.get(solvedProblem.Level) as ProblemLevel) + 1
          )
        : map,
    ProblemLevels.reduce(
      (map, level) => map.set(level, 0),
      new Map<ProblemLevel, number>()
    )
  );
  const difficultyLevelsTotalCountMap = problems.reduce(
    (map, problem) =>
      problem.ProblemType === ProblemType.Normal ||
      (problem.ProblemType === ProblemType.Educational &&
        includingEducational) ||
      (problem.ProblemType === ProblemType.Scoring && includingScoring) ||
      (problem.ProblemType === ProblemType.Joke && includingJoke) ||
      (problem.ProblemType === ProblemType.Unproved && includingUnproved)
        ? map.set(problem.Level, (map.get(problem.Level) as ProblemLevel) + 1)
        : map,
    ProblemLevels.reduce(
      (map, level) => map.set(level, 0),
      new Map<ProblemLevel, number>()
    )
  );

  return (
    <>
      <FormGroup className="mb-2">
        <ButtonGroup className="mr-4">
          <Button
            onClick={(): void => setIncludingEducational(!includingEducational)}
          >
            {includingEducational ? 'Including ' : 'Excluding '}
            <ProblemTypeIcon problemType={ProblemType.Educational} />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="mr-4">
          <Button onClick={(): void => setIncludingScoring(!includingScoring)}>
            {includingScoring ? 'Including ' : 'Excluding '}
            <ProblemTypeIcon problemType={ProblemType.Scoring} />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="mr-4">
          <Button onClick={(): void => setIncludingJoke(!includingJoke)}>
            {includingJoke ? 'Including ' : 'Excluding '}
            <ProblemTypeIcon problemType={ProblemType.Joke} />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="mr-4">
          <Button
            onClick={(): void => setIncludingUnproved(!includingUnproved)}
          >
            {includingUnproved ? 'Including ' : 'Excluding '}
            <ProblemTypeIcon problemType={ProblemType.Unproved} />
          </Button>
        </ButtonGroup>
      </FormGroup>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Level</th>
            {ProblemLevels.map((level) => (
              <th
                key={level}
                style={{
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  minWidth: '70px',
                }}
                className={getDifficultyLevelColorClass(level)}
              >
                <DifficultyStarsAbsoluteSpan
                  level={level}
                  showDifficultyLevel={true}
                  color={problemLinkColorMode === 'Level'}
                />
                {level}
              </th>
            ))}
          </tr>
          <tr>
            <th>Total</th>
            {ProblemLevels.map((level) => (
              <th key={level}>{difficultyLevelsTotalCountMap.get(level)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!user ? null : (
            <tr key={user}>
              <td>{user}</td>
              {ProblemLevels.map((level) => (
                <td
                  key={level}
                  className={
                    difficultyLevelsTotalCountMap.get(level) ===
                    difficultyLevelsSolvedCountMap.get(level)
                      ? 'table-problem table-problem-solved'
                      : 'table-problem'
                  }
                >
                  {difficultyLevelsSolvedCountMap.get(level)}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};
