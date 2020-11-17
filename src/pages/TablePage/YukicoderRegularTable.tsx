import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import React from 'react';
import dataFormat from 'dateformat';
import { Row, Spinner } from 'reactstrap';
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
import {
  ProblemLink,
  ProblemLinkColorMode,
} from '../../components/ProblemLink';

interface Props {
  title: string;
  contests: Contest[];
  mergedProblemsMap: Map<ProblemId, MergedProblem>;
  problemLinkColorMode: ProblemLinkColorMode;
  showDifficultyLevel: boolean;
  showContestResult: boolean;
  showContestDate: boolean;
  universalStateLoaded: boolean;
}

export const YukicoderRegularTable: React.FC<Props> = (props) => {
  const {
    contests,
    mergedProblemsMap,
    problemLinkColorMode,
    showDifficultyLevel,
    showContestResult,
    showContestDate,
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
  const solvedFlags = contests.reduce(
    (flags: ProblemSolveStatus[], curContest: Contest) => {
      curContest.ProblemIdList.forEach((pid: ProblemId, idx: number) => {
        const mergedProblem = mergedProblemsMap.get(pid);
        if (!mergedProblem) return;
        flags[idx] = Math.min(flags[idx], mergedProblem.SolveStatus);
      });
      return flags;
    },
    new Array(maxProblemCount).fill(
      ProblemSolveStatus.BeforeContest
    ) as ProblemSolveStatus[]
  );

  return (
    <Row className="my-4">
      <h3>{props.title}</h3>
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
            <>
              <ContestLink
                contestId={contest.Id}
                contestName={contest.Name.replace(/^yukicoder contest /, '')}
                rawContestName={contest.Name}
              />
              {showContestDate && (
                <div className="table-contest-date">
                  {dataFormat(new Date(contest.Date), 'yyyy/mm/dd')}
                </div>
              )}
            </>
          )}
        >
          Contest
        </TableHeaderColumn>
        {header.map((c, i) => (
          <TableHeaderColumn
            dataField={c}
            key={c}
            className={
              solvedFlags[i] === ProblemSolveStatus.BeforeContest
                ? 'table-problem table-problem-solved-before-contest'
                : solvedFlags[i] === ProblemSolveStatus.Intime
                ? 'table-problem table-problem-solved-intime'
                : solvedFlags[i] === ProblemSolveStatus.Solved
                ? 'table-problem table-problem-solved'
                : 'table-problem'
            }
            columnClassName={(_, contest: Contest) => {
              const pid =
                i in contest.ProblemIdList
                  ? contest.ProblemIdList[i]
                  : undefined;
              if (!pid) {
                return 'table-problem-empty';
              }
              const mergedProblem = mergedProblemsMap.get(pid);
              if (
                !mergedProblem ||
                mergedProblem.SolveStatus === ProblemSolveStatus.Trying
              ) {
                return 'table-problem';
              }
              if (
                !showContestResult ||
                mergedProblem.SolveStatus === ProblemSolveStatus.Solved
              )
                return 'table-problem table-problem-solved';
              if (mergedProblem.SolveStatus === ProblemSolveStatus.Intime)
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
                    color={problemLinkColorMode === 'Level'}
                  />
                  <ProblemTypeIconAbsoluteSpan
                    problemType={mergedProblem.ProblemType}
                  />
                  <ProblemLink
                    problemNo={mergedProblem.No as ProblemNo}
                    problemTitle={problemTitle}
                    level={mergedProblem.Level}
                    problemLinkColorMode={problemLinkColorMode}
                    id={`lnk-regular-table-${mergedProblem.ProblemId}`}
                    difficulty={mergedProblem.Difficulty}
                    augmented={mergedProblem.Augmented}
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
