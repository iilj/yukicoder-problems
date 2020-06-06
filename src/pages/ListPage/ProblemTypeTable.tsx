import React from 'react';
import Table from 'reactstrap/lib/Table';
import { ProblemTypeIconSpanWithName } from '../../components/ProblemTypeIcon';
import { Problem, ProblemType, ProblemTypes } from '../../interfaces/Problem';

export const ProblemTypeTable = (props: {
  problems: Problem[];
  solvedProblems: Problem[];
  user: string;
}) => {
  const { problems, solvedProblems, user } = props;

  const problemTypesTotalCountMap = problems.reduce(
    (map, problem) => map.set(problem.ProblemType, (map.get(problem.ProblemType) as ProblemType) + 1),
    ProblemTypes.reduce((map, type) => map.set(type, 0), new Map<ProblemType, number>()),
  );
  const problemTypesSolvedCountMap = solvedProblems.reduce(
    (map, solvedProblem) => map.set(solvedProblem.ProblemType, (map.get(solvedProblem.ProblemType) as ProblemType) + 1),
    ProblemTypes.reduce((map, type) => map.set(type, 0), new Map<ProblemType, number>()),
  );

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Type</th>
            {ProblemTypes.map((type) => (
              <th
                key={type}
                style={{ whiteSpace: 'nowrap', position: 'relative', minWidth: '70px' }}
              >
                <ProblemTypeIconSpanWithName problemType={type} />
              </th>
            ))}
          </tr>
          <tr>
            <th>Total</th>
            {ProblemTypes.map((type) => (
              <th key={type}>{problemTypesTotalCountMap.get(type)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!user ? null : (
            <tr key={user}>
              <td>{user}</td>
              {ProblemTypes.map((type) => (
                <td key={type}>{problemTypesSolvedCountMap.get(type)}</td>
              ))}
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};
