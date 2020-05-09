import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import dataFormat from 'dateformat';
import { ProblemLink } from '../../components/ProblemLink';
import { ContestLink } from '../../components/ContestLink';
import { DifficultyStars } from '../../components/DifficultyStars';
import { ListPaginationPanel } from '../../components/ListPaginationPanel';

export const SolvedProblemList = (props) => {
  const {
    solvedProblems, problemContestMap, contestMap, fromDate, toDate,
  } = props;

  return (
    <BootstrapTable
      data={solvedProblems
        .filter((problem) => {
          if (fromDate === null && toDate === null) return true;
          if (problem.Date === null) return false;
          const solveDate = Date.parse(problem.Date);
          if (fromDate === null) return solveDate <= toDate;
          if (toDate === null) return fromDate <= solveDate;
          return fromDate <= solveDate && solveDate <= toDate;
        })
        .sort((a, b) => (a.Date < b.Date ? 1 : -1))
        .map((s) => ({ Contest: contestMap[problemContestMap[s.ProblemId]], ...s }))}
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
        paginationPanel: (paginationPanelProps) => (
          <ListPaginationPanel {...paginationPanelProps} />
        ),
      }}
    >
      <TableHeaderColumn
        dataSort
        dataField="Date"
        dataFormat={(date) => <>{dataFormat(new Date(date), 'yyyy/mm/dd HH:MM')}</>}
      >
        Date
      </TableHeaderColumn>
      <TableHeaderColumn
        filterFormatted
        dataSort
        dataField="Title"
        dataFormat={(title, row) => (
          <ProblemLink
            problemTitle={title}
            problemNo={row.No}
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
        dataFormat={(level) => <DifficultyStars level={level} showDifficultyLevel />}
      >
        Level
      </TableHeaderColumn>
      <TableHeaderColumn
        filterFormatted
        dataSort
        dataField="Contest"
        dataFormat={(contest) => (contest ? <ContestLink contestId={contest.Id} contestName={contest.Name} /> : null)}
      >
        Contest
      </TableHeaderColumn>
      <TableHeaderColumn dataField="Title" hidden />
    </BootstrapTable>
  );
};
