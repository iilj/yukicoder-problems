import { Table, Row } from "reactstrap";
import React from "react";
import { ProblemLink } from "../../components/ProblemLink";
import { ContestLink } from "../../components/ContestLink"
import { DifficultyStarsAbsoluteSpan } from "../../components/DifficultyStars";
import { SubmitTimespan } from "../../components/SubmitTimespan"

export const ContestTable = (props) => {
  const {
    contests,
    problemsMap,
    solvedProblemsMap,
    showDifficultyLevel,
    showContestResult
  } = props;
  return (
    <>
      <Row className="my-4">
        <h2>{props.title}</h2>
      </Row>
      <div>
        {contests.map(contest => {
          return (
            <div key={contest.Id} className="contest-table-responsive">
              <strong>
                <ContestLink contestId={contest.Id} contestName={contest.Name} />
              </strong>
              <Table
                striped
                bordered
                hover
                responsive
                className="contest-other-table-responsive"
              >
                <tbody>
                  <tr>
                    {contest.ProblemIdList.map(pid => {
                      if (problemsMap !== undefined && pid in problemsMap) {
                        const problem = problemsMap[pid];
                        const solvedProblem = (solvedProblemsMap && pid in solvedProblemsMap)
                          ? solvedProblemsMap[pid] : undefined;
                        let className;
                        if (!solvedProblem) {
                          className = "table-problem";
                        } else {
                          const solvedDate = Date.parse(solvedProblem.Date);
                          const startDate = Date.parse(contest.Date)
                          const endDate = Date.parse(contest.EndDate);
                          if (!showContestResult || solvedDate > endDate)
                            className = "table-problem table-problem-solved";
                          else if (solvedDate >= startDate)
                            className = "table-problem table-problem-solved-intime";
                          else
                            className = "table-problem table-problem-solved-before-contest";
                        }
                        return (
                          <td
                            key={pid}
                            className={className}
                          >
                            <DifficultyStarsAbsoluteSpan level={problem.Level} showDifficultyLevel={showDifficultyLevel} />
                            <ProblemLink problemNo={problem.No} problemTitle={problem.Title} level={problem.Level} showDifficultyLevel={showDifficultyLevel} />
                            <SubmitTimespan contest={contest} solvedProblem={solvedProblem} showContestResult={showContestResult} />
                          </td>
                        );
                      } else {
                        return (
                          <td key={pid}>(Id={pid})</td>
                        );
                      }
                    })}
                  </tr>
                </tbody>
              </Table>
            </div>
          );
        })}
      </div>
    </>
  );
}