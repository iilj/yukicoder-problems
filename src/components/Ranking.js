import React from 'react';
import { Row } from 'reactstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { ListPaginationPanel } from './ListPaginationPanel';

const refineRanking = (ranking) => ranking
  .sort((a, b) => b.count - a.count)
  .reduce((list, entry, index) => {
    const last = list[list.length - 1];
    list.push({
      rank: last && last.count === entry.count ? last.rank : index + 1,
      name: entry.name,
      count: entry.count,
    });
    return list;
  }, []);

export const Ranking = (props) => (
  <Row>
    <h2>{props.title}</h2>
    <BootstrapTable
      height="auto"
      data={refineRanking(props.ranking)}
      pagination
      striped
      hover
      search
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
            value: props.ranking.length,
          },
        ],
        paginationPanel: (paginationPanelProps) => <ListPaginationPanel {...paginationPanelProps} />,
      }}
    >
      <TableHeaderColumn dataField="rank">#</TableHeaderColumn>
      <TableHeaderColumn dataField="name" isKey>
        Name
      </TableHeaderColumn>
      <TableHeaderColumn dataField="count">Count</TableHeaderColumn>
    </BootstrapTable>
  </Row>
);
