import React from 'react';
import {
  Row, Col, Table, UncontrolledTooltip,
} from 'reactstrap';
import { ProblemLink } from '../../components/ProblemLink';
import { DifficultyStars } from '../../components/DifficultyStars';
import { range } from '../../utils';
import './AllProblemsTable.css';
import { Contest, ContestId } from '../../interfaces/Contest';
import { Problem, ProblemId, ProblemNo } from '../../interfaces/Problem';

export const AllProblemsTable = (props: {
  title: string;
  problems: Problem[];
  contestMap: Map<ContestId, Contest>;
  problemContestMap: Map<ProblemId, ContestId>;
  solvedProblemsMap: Map<ProblemId, Problem>;
  showDifficultyLevel: boolean;
  showContestResult: boolean;
}) => {
  const {
    problems,
    contestMap,
    problemContestMap,
    solvedProblemsMap,
    showDifficultyLevel,
    showContestResult,
  } = props;
  const problemTables = problems
    .filter((a) => a.No !== null)
    .sort((a, b) => (a.No as ProblemNo) - (b.No as ProblemNo))
    .reduce((prevMap, problem) => {
      const key = Math.min(Math.floor(((problem.No as ProblemNo) - 1) / 100), 29);
      if (!prevMap.has(key)) {
        prevMap.set(key, []);
      }
      (prevMap.get(key) as Problem[]).push(problem);
      return prevMap;
    }, new Map<number, Problem[]>());
  const problemTableEntries = [] as [number, Problem[]][];
  problemTables.forEach((problems, key) => {
    problemTableEntries.push([key, problems]);
  });
  return (
    <>
      <Row className="my-4">
        <h2>{props.title}</h2>
      </Row>
      <div className="my-inner-container">
        <Row className="my-4">
          {problemTableEntries.map(([key, curTableProblems]) => (
            <Col key={key} className="text-center" xs="12" sm="12" md="6" lg="6" xl="4">
              <Table striped bordered hover className="problemsTable">
                <tbody>
                  {range(0, 9).map((rowidx: number) => {
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
                          const solvedProblem = solvedProblemsMap && solvedProblemsMap.has(pid)
                            ? solvedProblemsMap.get(pid)
                            : undefined;
                          const contestId = problemContestMap && problemContestMap.has(pid)
                            ? problemContestMap.get(pid)
                            : undefined;
                          const contest = contestId ? contestMap.get(contestId) : undefined;
                          let className: string;
                          if (!solvedProblem) {
                            className = 'table-problem';
                          } else if (!contestId) {
                            className = 'table-problem table-problem-solved';
                          } else {
                            const solvedDate = Date.parse(solvedProblem.Date as string);
                            const startDate = Date.parse((contest as Contest).Date);
                            const endDate = Date.parse((contest as Contest).EndDate);
                            if (!showContestResult || solvedDate > endDate) className = 'table-problem table-problem-solved';
                            else if (solvedDate >= startDate) className = 'table-problem table-problem-solved-intime';
                            else className = 'table-problem table-problem-solved-before-contest';
                          }
                          const elementId = `AllProblems_td_${problem.No}`;
                          return (
                            <td key={pid} className={className} id={elementId}>
                              <ProblemLink
                                problemNo={problem.No as ProblemNo}
                                problemTitle={`${problem.No}`}
                                level={problem.Level}
                                showDifficultyLevel={showDifficultyLevel}
                                id={`AllProblems_td_${problem.No}`}
                              />
                              <UncontrolledTooltip
                                target={elementId}
                                style={{
                                  backgroundColor: 'rgba(240, 240, 240, 1.0)',
                                  border: '1px solid #808080',
                                  opacity: '1.0',
                                }}
                              >
                                <div>
                                  <ProblemLink
                                    problemNo={problem.No as ProblemNo}
                                    problemTitle={`${problem.Title}`}
                                    level={problem.Level}
                                    showDifficultyLevel={showDifficultyLevel}
                                    id={`AllProblems_td_${problem.No}`}
                                  />
                                </div>
                                <div>
                                  <DifficultyStars
                                    level={problem.Level}
                                    showDifficultyLevel={showDifficultyLevel}
                                  />
                                </div>
                              </UncontrolledTooltip>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};
