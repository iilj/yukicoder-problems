import React from 'react';
import Table from 'reactstrap/lib/Table';
import { ProblemTypeIconSpanWithName } from '../../components/ProblemTypeIcon';
import { Problem, ProblemType, ProblemTypes } from '../../interfaces/Problem';
import { FirstSolvedProblem } from '../../interfaces/SolvedProblem';

interface Props {
  problems: Problem[];
  firstSolvedProblems: FirstSolvedProblem[];
  user: string;
}

export const ProblemTypeTable: React.FC<Props> = (props) => {
  const { problems, firstSolvedProblems, user } = props;

  const problemTypesTotalCountMap = problems.reduce(
    (map, problem) =>
      map.set(
        problem.ProblemType,
        (map.get(problem.ProblemType) as ProblemType) + 1
      ),
    ProblemTypes.reduce(
      (map, type) => map.set(type, 0),
      new Map<ProblemType, number>()
    )
  );
  const problemTypesSolvedCountMap = firstSolvedProblems.reduce(
    (map, firstSolvedProblem) =>
      map.set(
        firstSolvedProblem.ProblemType,
        (map.get(firstSolvedProblem.ProblemType) as ProblemType) + 1
      ),
    ProblemTypes.reduce(
      (map, type) => map.set(type, 0),
      new Map<ProblemType, number>()
    )
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
                style={{
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  minWidth: '150px',
                }}
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
                <td
                  key={type}
                  className={
                    problemTypesTotalCountMap.get(type) ===
                    problemTypesSolvedCountMap.get(type)
                      ? 'table-problem table-problem-solved'
                      : 'table-problem'
                  }
                >
                  {problemTypesSolvedCountMap.get(type)}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};
