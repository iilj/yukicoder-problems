import React from 'react';
import { Row, Col, Table } from 'reactstrap';
import { ProblemLink } from '../../components/ProblemLink';
import { range } from '../../utils';
import './AllProblemsTable.css';

export const AllProblemsTable = (props) => {
  const {
    contestMap,
    problemContestMap,
    problemsMap,
    solvedProblemsMap,
    showDifficultyLevel,
    showContestResult,
  } = props;
  const problems = Object.values(problemsMap).sort((a, b) => a.No - b.No);
  const problemTables = problems.reduce((prevMap, problem) => {
    const key = Math.min(Math.floor((problem.No - 1) / 100), 29);
    if (!(key in prevMap)) {
      prevMap[key] = [];
    }
    prevMap[key].push(problem);
    return prevMap;
  }, {});
  return (
    <>
      <Row className="my-4">
        <h2>{props.title}</h2>
      </Row>
      <Row className="my-4">
        {Object.keys(problemTables).map((key) => {
          const curTableProblems = problemTables[key];
          return (
            <Col key={key} className="text-center" xs="12" sm="6" md="6" lg="6" xl="4">
              <Table striped bordered hover className="problemsTable">
                <tbody>
                  {range(0, 9).map((rowidx) => {
                    const offset = rowidx * 10;
                    if (curTableProblems.length <= offset) {
                      return null;
                    }
                    return (
                      <tr key={offset}>
                        {range(0, 9).map((colidx) => {
                          const idx = offset + colidx;
                          if (idx >= curTableProblems.length) return null;
                          const problem = curTableProblems[idx];
                          const pid = problem.ProblemId;
                          const solvedProblem = solvedProblemsMap && pid in solvedProblemsMap
                            ? solvedProblemsMap[pid]
                            : undefined;
                          const contestId = problemContestMap && pid in problemContestMap
                            ? problemContestMap[pid]
                            : undefined;
                          const contest = contestId ? contestMap[contestId] : undefined;
                          let className;
                          if (!solvedProblem) {
                            className = 'table-problem';
                          } else if (!contestId) {
                            className = 'table-problem table-problem-solved';
                          } else {
                            const solvedDate = Date.parse(solvedProblem.Date);
                            const startDate = Date.parse(contest.Date);
                            const endDate = Date.parse(contest.EndDate);
                            if (!showContestResult || solvedDate > endDate) className = 'table-problem table-problem-solved';
                            else if (solvedDate >= startDate) className = 'table-problem table-problem-solved-intime';
                            else className = 'table-problem table-problem-solved-before-contest';
                          }
                          return (
                            <td key={pid} className={className}>
                              <ProblemLink
                                problemNo={problem.No}
                                problemTitle={`${problem.No}`}
                                level={problem.Level}
                                showDifficultyLevel={showDifficultyLevel}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          );
        })}
      </Row>
    </>
  );
};
