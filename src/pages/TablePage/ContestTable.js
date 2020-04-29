import { Table, Row } from 'reactstrap';
import React from 'react';
import { ProblemLink } from '../../components/ProblemLink';
import { ContestLink } from '../../components/ContestLink';
import { DifficultyStarsAbsoluteSpan } from '../../components/DifficultyStars';
import { SubmitTimespan } from '../../components/SubmitTimespan';
import { ProblemTypeIconAbsoluteSpan } from '../../components/ProblemTypeIcon';

export const ContestTable = (props) => {
  const {
    contests,
    problemsMap,
    solvedProblemsMap,
    showDifficultyLevel,
    showContestResult,
  } = props;
  const header = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  return (
    <>
      <Row className="my-4">
        <h2>{props.title}</h2>
      </Row>
      <div>
        {contests.map((contest) => (
          <div key={contest.Id} className="contest-table">
            <strong>
              <ContestLink contestId={contest.Id} contestName={contest.Name} />
            </strong>
            <Table striped bordered hover className="contest-other-table">
              <tbody>
                <tr>
                  {contest.ProblemIdList.map((pid, i) => {
                    if (problemsMap !== undefined && pid in problemsMap) {
                      const problem = problemsMap[pid];
                      const solvedProblem = solvedProblemsMap && pid in solvedProblemsMap
                        ? solvedProblemsMap[pid]
                        : undefined;
                      let className;
                      if (!solvedProblem) {
                        className = 'table-problem';
                      } else {
                        const solvedDate = Date.parse(solvedProblem.Date);
                        const startDate = Date.parse(contest.Date);
                        const endDate = Date.parse(contest.EndDate);
                        if (!showContestResult || solvedDate > endDate) className = 'table-problem table-problem-solved';
                        else if (solvedDate >= startDate) className = 'table-problem table-problem-solved-intime';
                        else className = 'table-problem table-problem-solved-before-contest';
                      }

                      const problemTitle = `${header[i]}. ${problem.Title}`;

                      return (
                        <td key={pid} className={className}>
                          <DifficultyStarsAbsoluteSpan
                            level={problem.Level}
                            showDifficultyLevel={showDifficultyLevel}
                          />
                          <ProblemTypeIconAbsoluteSpan problemType={problem.ProblemType} />
                          <ProblemLink
                            problemNo={problem.No}
                            problemTitle={problemTitle}
                            level={problem.Level}
                            showDifficultyLevel={showDifficultyLevel}
                          />
                          <SubmitTimespan
                            contest={contest}
                            solvedProblem={solvedProblem}
                            showContestResult={showContestResult}
                          />
                        </td>
                      );
                    }
                    return (
                      <td key={pid}>
                        (Id=
                        {pid}
                        )
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </Table>
          </div>
        ))}
      </div>
    </>
  );
};
