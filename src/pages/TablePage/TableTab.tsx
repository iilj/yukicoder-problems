import React from 'react';
import { Row, ButtonGroup, Button } from 'reactstrap';

export enum ContestTableTab {
  'regular' = 0,
  'other' = 1,
  'other_problems' = 2,
  'all' = 3,
}

interface Props {
  active: ContestTableTab;
  setActive: (next: ContestTableTab) => void;
}

export const TableTabButtons: React.FC<Props> = (props) => {
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
          yukicoder contest
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setActive(ContestTableTab.other);
          }}
          active={active === ContestTableTab.other}
        >
          Other Contests
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setActive(ContestTableTab.other_problems);
          }}
          active={active === ContestTableTab.other_problems}
        >
          Other Problems
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
