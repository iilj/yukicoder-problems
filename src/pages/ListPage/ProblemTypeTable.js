import React from 'react';
import Table from 'reactstrap/lib/Table';

export const ProblemTypeTable = (props) => {
  const { problems, solvedProblems, user } = props;
  const problemTypes = [0, 1, 2, 3];

  const problemTypesTotalCountMap = problems.reduce(
    (map, problem) => {
      if (!(problem.ProblemType in map)) {
        map[problem.ProblemType] = 0;
        problemTypes.push(problem.ProblemType);
      }
      map[problem.ProblemType] += 1;
      return map;
    },
    problemTypes.reduce((map, type) => {
      map[type] = 0;
      return map;
    }, {}),
  );
  problemTypes.sort();
  const problemTypesSolvedCountMap = solvedProblems.reduce(
    (map, solvedProblem) => {
      map[solvedProblem.ProblemType] += 1;
      return map;
    },
    problemTypes.reduce((map, type) => {
      map[type] = 0;
      return map;
    }, {}),
  );

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Type</th>
            {problemTypes.map((type) => (
              <th
                key={type}
                style={{ whiteSpace: 'nowrap', position: 'relative', minWidth: '70px' }}
              >
                {type}
              </th>
            ))}
          </tr>
          <tr>
            <th>Total</th>
            {problemTypes.map((type) => (
              <th key={type}>{problemTypesTotalCountMap[type]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!user ? null : (
            <tr key={user}>
              <td>{user}</td>
              {problemTypes.map((type) => (
                <td key={type}>{problemTypesSolvedCountMap[type]}</td>
              ))}
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};
