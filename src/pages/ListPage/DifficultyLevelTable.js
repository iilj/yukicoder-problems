import React from 'react';
import Table from 'reactstrap/lib/Table';
import { DifficultyStars } from '../../components/DifficultyStars';
import { getDifficultyLevelColorClass } from '../../utils';

export const DifficultyLevelTable = (props) => {
  const { problems, solvedProblems, user } = props;
  const difficultyLevels = [0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];

  const difficultyLevelsSolvedCountMap = solvedProblems.reduce(
    (map, solvedProblem) => {
      map[solvedProblem.Level] += 1;
      return map;
    },
    difficultyLevels.reduce((map, dif) => {
      map[dif] = 0;
      return map;
    }, {}),
  );
  const difficultyLevelsTotalCountMap = problems.reduce(
    (map, problem) => {
      map[problem.Level] += 1;
      return map;
    },
    difficultyLevels.reduce((map, dif) => {
      map[dif] = 0;
      return map;
    }, {}),
  );

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Level</th>
            {difficultyLevels.map((level) => (
              <th
                key={level}
                style={{ whiteSpace: 'nowrap' }}
                className={getDifficultyLevelColorClass(level)}
              >
                {level}
                <DifficultyStars level={level} showDifficultyLevel />
              </th>
            ))}
          </tr>
          <tr>
            <th>Total</th>
            {difficultyLevels.map((level) => (
              <th key={level}>{difficultyLevelsTotalCountMap[level]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!user ? null : (
            <tr key={user}>
              <td>{user}</td>
              {difficultyLevels.map((level) => (
                <td key={level}>{difficultyLevelsSolvedCountMap[level]}</td>
              ))}
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};
