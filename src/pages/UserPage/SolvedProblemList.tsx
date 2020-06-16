import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import dataFormat from 'dateformat';
import { ProblemLink } from '../../components/ProblemLink';
import { ContestLink } from '../../components/ContestLink';
import { DifficultyStars } from '../../components/DifficultyStars';
import {
  ListPaginationPanel,
  ListPaginationPanelProps,
} from '../../components/ListPaginationPanel';
import { ProblemId, ProblemLevel, ProblemNo } from '../../interfaces/Problem';
import { SolvedProblem } from '../../interfaces/SolvedProblem';
import { Contest, ContestId } from '../../interfaces/Contest';

interface Entry extends SolvedProblem {
  Contest: Contest | undefined;
}

interface Props {
  solvedProblems: SolvedProblem[];
  problemContestMap: Map<ProblemId, ContestId>;
  contestMap: Map<ContestId, Contest>;
  fromDate: Date;
  toDate: Date;
}

export const SolvedProblemList: React.FC<Props> = (props) => {
  const {
    solvedProblems,
    problemContestMap,
    contestMap,
    fromDate,
    toDate,
  } = props;

  return (
    <BootstrapTable
      data={solvedProblems
        .filter((problem) => {
          if (fromDate === null && toDate === null) return true;
          if (problem.Date === null) return false;
          const solveDate = new Date(problem.Date);
          if (fromDate === null) return solveDate <= toDate;
          if (toDate === null) return fromDate <= solveDate;
          return fromDate <= solveDate && solveDate <= toDate;
        })
        .sort((a, b) => (a.Date < b.Date ? 1 : -1))
        .map(
          (s) =>
            ({
              Contest: contestMap.get(problemContestMap.get(s.ProblemId) ?? -1),
              ...s,
            } as Entry)
        )}
      keyField="ProblemId"
      height="auto"
      hover
      striped
      search
      pagination
      options={{
        paginationPosition: 'top',
        sizePerPage: 20,
        sizePerPageList: [
          {
            text: '20',
            value: 20,
          },
          {
            text: '50',
            value: 50,
          },
          {
            text: '100',
            value: 100,
          },
          {
            text: '200',
            value: 200,
          },
          {
            text: 'All',
            value: solvedProblems.length,
          },
        ],
        paginationPanel: function _paginationPanel(
          paginationPanelProps: ListPaginationPanelProps
        ) {
          return <ListPaginationPanel {...paginationPanelProps} />;
        },
      }}
    >
      <TableHeaderColumn
        dataSort
        dataField="Date"
        dataFormat={(date: string) => (
          <>{dataFormat(new Date(date), 'yyyy/mm/dd HH:MM')}</>
        )}
      >
        Date
      </TableHeaderColumn>
      <TableHeaderColumn
        filterFormatted
        dataSort
        dataField="Title"
        dataFormat={(title: string, row: Entry) => (
          <ProblemLink
            problemTitle={title}
            problemNo={row.No as ProblemNo}
            level={row.Level}
            showDifficultyLevel
          />
        )}
      >
        Problem
      </TableHeaderColumn>
      <TableHeaderColumn
        filterFormatted
        dataSort
        dataField="Level"
        dataFormat={(level: ProblemLevel) => (
          <DifficultyStars level={level} showDifficultyLevel />
        )}
      >
        Level
      </TableHeaderColumn>
      <TableHeaderColumn
        filterFormatted
        dataSort
        dataField="Contest"
        dataFormat={(contest: Contest) =>
          contest ? (
            <ContestLink contestId={contest.Id} contestName={contest.Name} />
          ) : (
            <></>
          )
        }
      >
        Contest
      </TableHeaderColumn>
      <TableHeaderColumn dataField="Title" hidden />
    </BootstrapTable>
  );
};
