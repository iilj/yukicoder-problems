import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import React from 'react';
import { Row, Spinner } from 'reactstrap';
import { ProblemLink } from '../../components/ProblemLink';
import { ContestLink } from '../../components/ContestLink';
import { DifficultyStarsAbsoluteSpan } from '../../components/DifficultyStars';
import { SubmitTimespan } from '../../components/SubmitTimespan';
import { ProblemTypeIconAbsoluteSpan } from '../../components/ProblemTypeIcon';
import { Contest } from '../../interfaces/Contest';
import { ProblemId, ProblemNo } from '../../interfaces/Problem';
import {
  MergedProblem,
  ProblemSolveStatus,
} from '../../interfaces/MergedProblem';

interface Props {
  title: string;
  contests: Contest[];
  mergedProblemsMap: Map<ProblemId, MergedProblem>;
  showDifficultyLevel: boolean;
  showContestResult: boolean;
  universalStateLoaded: boolean;
}

export const YukicoderRegularTable: React.FC<Props> = (props) => {
  const {
    contests,
    mergedProblemsMap,
    showDifficultyLevel,
    showContestResult,
    universalStateLoaded,
  } = props;

  const maxProblemCount = contests.reduce(
    (currentCount, contest) =>
      Math.max(contest.ProblemIdList.length, currentCount),
    0
  );

  const header = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].slice(
    0,
    maxProblemCount
  );
  return (
    <Row className="my-4">
      <h2>{props.title}</h2>
      {universalStateLoaded ? (
        <></>
      ) : (
        <Spinner
          style={{ width: '2.5rem', height: '2.5rem', marginLeft: '0.8rem' }}
        />
      )}
      <BootstrapTable
        data={contests.sort((a, b) => (a.Date < b.Date ? 1 : -1))}
        tableContainerClass="contest-table contest-regular-table"
      >
        <TableHeaderColumn
          isKey
          dataField="Name"
          columnClassName={(_, contest: Contest) => {
            const solveStatusList = contest.ProblemIdList.map(
              (pid: ProblemId): ProblemSolveStatus => {
                const mergedProblem = mergedProblemsMap.get(pid);
                if (!mergedProblem) return ProblemSolveStatus.Trying;
                return mergedProblem.SolveStatus;
              }
            );
            if (
              showContestResult &&
              solveStatusList.every(
                (stat) => stat === ProblemSolveStatus.BeforeContest
              )
            )
              return 'table-problem table-problem-solved-before-contest';
            if (
              showContestResult &&
              solveStatusList.every((stat) => stat >= ProblemSolveStatus.Intime)
            )
              return 'table-problem table-problem-solved-intime';
            if (
              solveStatusList.every((stat) => stat >= ProblemSolveStatus.Solved)
            )
              return 'table-problem table-problem-solved';
            return 'table-problem';
          }}
          dataFormat={(_, contest: Contest) => (
            <ContestLink
              contestId={contest.Id}
              contestName={contest.Name.replace(/^yukicoder contest /, '')}
              rawContestName={contest.Name}
            />
          )}
        >
          Contest
        </TableHeaderColumn>
        {header.map((c, i) => (
          <TableHeaderColumn
            dataField={c}
            key={c}
            columnClassName={(_, contest: Contest) => {
              const pid =
                i in contest.ProblemIdList
                  ? contest.ProblemIdList[i]
                  : undefined;
              if (!pid) {
                return 'table-problem-empty';
              }
              const MergedProblem = mergedProblemsMap.get(pid);
              if (
                !MergedProblem ||
                MergedProblem.SolveStatus === ProblemSolveStatus.Trying
              ) {
                return 'table-problem';
              }
              if (
                !showContestResult ||
                MergedProblem.SolveStatus === ProblemSolveStatus.Solved
              )
                return 'table-problem table-problem-solved';
              if (MergedProblem.SolveStatus === ProblemSolveStatus.Intime)
                return 'table-problem table-problem-solved-intime';
              return 'table-problem table-problem-solved-before-contest';
            }}
            dataFormat={(_, contest: Contest) => {
              const pid =
                i in contest.ProblemIdList
                  ? contest.ProblemIdList[i]
                  : undefined;
              if (!pid) {
                return '';
              }
              const mergedProblem = mergedProblemsMap.get(pid);
              if (!mergedProblem) {
                return (
                  <span>
                    (Id=
                    {pid})
                  </span>
                );
              }

              const problemTitle = `${header[i]}. ${mergedProblem.Title}`;

              return (
                <>
                  <DifficultyStarsAbsoluteSpan
                    level={mergedProblem.Level}
                    showDifficultyLevel={showDifficultyLevel}
                  />
                  <ProblemTypeIconAbsoluteSpan
                    problemType={mergedProblem.ProblemType}
                  />
                  <ProblemLink
                    problemNo={mergedProblem.No as ProblemNo}
                    problemTitle={problemTitle}
                    level={mergedProblem.Level}
                    showDifficultyLevel={showDifficultyLevel}
                  />
                  <SubmitTimespan
                    mergedProblem={mergedProblem}
                    showContestResult={showContestResult}
                  />
                </>
              );
            }}
          >
            {c}
          </TableHeaderColumn>
        ))}
      </BootstrapTable>
    </Row>
  );
};
