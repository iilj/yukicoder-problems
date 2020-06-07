import React from 'react';
import { Row, ButtonGroup, Button } from 'reactstrap';

export enum ContestTableTab {
  'regular' = 0,
  'long' = 1,
  'other' = 2,
  'all' = 3,
}

export const TableTabButtons = (props: {
  active: ContestTableTab;
  setActive: (next: ContestTableTab) => void;
}) => {
  const { active, setActive } = props;
  return (
    <Row>
      <ButtonGroup className="table-tab">
        <Button
          color="secondary"
          onClick={() => {
            setActive(ContestTableTab.regular);
          }}
          active={active === ContestTableTab.regular}
        >
          yukicoder contest (regular)
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setActive(ContestTableTab.long);
          }}
          active={active === ContestTableTab.long}
        >
          yukicoder contest (long)
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setActive(ContestTableTab.other);
          }}
          active={active === ContestTableTab.other}
        >
          Other contests
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setActive(ContestTableTab.all);
          }}
          active={active === ContestTableTab.all}
        >
          All Problems
        </Button>
      </ButtonGroup>
    </Row>
  );
};
