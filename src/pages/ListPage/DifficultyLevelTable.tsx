import React from 'react';
import Table from 'reactstrap/lib/Table';
import { DifficultyStarsAbsoluteSpan } from '../../components/DifficultyStars';
import { getDifficultyLevelColorClass } from '../../utils';
import { Problem, ProblemLevels, ProblemLevel } from '../../interfaces/Problem';
import { SolvedProblem } from '../../interfaces/SolvedProblem';

interface Props {
  problems: Problem[];
  solvedProblems: SolvedProblem[];
  user: string;
}

export const DifficultyLevelTable: React.FC<Props> = (props) => {
  const { problems, solvedProblems, user } = props;

  const difficultyLevelsSolvedCountMap = solvedProblems.reduce(
    (map, solvedProblem) =>
      map.set(
        solvedProblem.Level,
        (map.get(solvedProblem.Level) as ProblemLevel) + 1
      ),
    ProblemLevels.reduce(
      (map, level) => map.set(level, 0),
      new Map<ProblemLevel, number>()
    )
  );
  const difficultyLevelsTotalCountMap = problems.reduce(
    (map, problem) =>
      map.set(problem.Level, (map.get(problem.Level) as ProblemLevel) + 1),
    ProblemLevels.reduce(
      (map, level) => map.set(level, 0),
      new Map<ProblemLevel, number>()
    )
  );

  return (
    <>
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
                  showDifficultyLevel
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
                <td key={level}>{difficultyLevelsSolvedCountMap.get(level)}</td>
              ))}
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};
