import React from 'react';
import { Row, Col, Table, UncontrolledTooltip, Spinner } from 'reactstrap';
import { ProblemLink } from '../../components/ProblemLink';
import { DifficultyStars } from '../../components/DifficultyStars';
import { range } from '../../utils';
import './AllProblemsTable.css';
import { ProblemNo } from '../../interfaces/Problem';
import {
  MergedProblem,
  ProblemSolveStatus,
} from '../../interfaces/MergedProblem';

interface Props {
  title: string;
  mergedProblems: MergedProblem[];
  showDifficultyLevel: boolean;
  showContestResult: boolean;
  universalStateLoaded: boolean;
}

export const AllProblemsTable: React.FC<Props> = (props) => {
  const {
    mergedProblems,
    showDifficultyLevel,
    showContestResult,
    universalStateLoaded,
  } = props;

  const problemTables = mergedProblems
    .filter((a) => a.No !== null)
    .sort((a, b) => (a.No as ProblemNo) - (b.No as ProblemNo))
    .reduce((prevMap, problem) => {
      const key = Math.min(
        Math.floor(((problem.No as ProblemNo) - 1) / 100),
        29
      );
      if (!prevMap.has(key)) {
        prevMap.set(key, []);
      }
      (prevMap.get(key) as MergedProblem[]).push(problem);
      return prevMap;
    }, new Map<number, MergedProblem[]>());
  const problemTableEntries = [] as [number, MergedProblem[]][];
  problemTables.forEach((problems, key) => {
    problemTableEntries.push([key, problems]);
  });
  return (
    <>
      <Row className="my-4">
        <h3>{props.title}</h3>
        {universalStateLoaded ? (
          <></>
        ) : (
          <Spinner
            style={{ width: '2.5rem', height: '2.5rem', marginLeft: '0.8rem' }}
          />
        )}
      </Row>
      <div className="my-inner-container">
        <Row className="my-4">
          {problemTableEntries.map(([key, curTableProblems]) => (
            <Col
              key={key}
              className="text-center"
              xs="12"
              sm="12"
              md="6"
              lg="6"
              xl="4"
            >
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
                          const mergedProblem = curTableProblems[idx];
                          let className: string;
                          if (
                            mergedProblem.SolveStatus ===
                            ProblemSolveStatus.Trying
                          ) {
                            className = 'table-problem';
                          } else if (!mergedProblem.Contest) {
                            className = 'table-problem table-problem-solved';
                          } else {
                            if (
                              !showContestResult ||
                              mergedProblem.SolveStatus ===
                                ProblemSolveStatus.Solved
                            )
                              className = 'table-problem table-problem-solved';
                            else if (
                              mergedProblem.SolveStatus ===
                              ProblemSolveStatus.Intime
                            )
                              className =
                                'table-problem table-problem-solved-intime';
                            else
                              className =
                                'table-problem table-problem-solved-before-contest';
                          }

                          const elementId = `AllProblems_td_${
                            mergedProblem.No as number
                          }`;
                          return (
                            <td
                              key={mergedProblem.ProblemId}
                              className={className}
                              id={elementId}
                            >
                              <ProblemLink
                                problemNo={mergedProblem.No as ProblemNo}
                                problemTitle={`${mergedProblem.No as number}`}
                                level={mergedProblem.Level}
                                showDifficultyLevel={showDifficultyLevel}
                                id={`AllProblems_td_${
                                  mergedProblem.No as number
                                }`}
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
                                    problemNo={mergedProblem.No as ProblemNo}
                                    problemTitle={`${mergedProblem.Title}`}
                                    level={mergedProblem.Level}
                                    showDifficultyLevel={showDifficultyLevel}
                                    id={`AllProblems_td_${
                                      mergedProblem.No as number
                                    }`}
                                  />
                                </div>
                                <div>
                                  <DifficultyStars
                                    level={mergedProblem.Level}
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
