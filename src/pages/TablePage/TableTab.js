import React from 'react';
import { Row, ButtonGroup, Button } from 'reactstrap';

export const TableTabButtons = (props) => {
  const { active, setActive } = props;
  return (
    <Row>
      <ButtonGroup className="table-tab">
        <Button
          color="secondary"
          onClick={() => {
            setActive(0);
          }}
          active={active === 0}
        >
          yukicoder contest (regular)
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setActive(1);
          }}
          active={active === 1}
        >
          yukicoder contest (long)
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setActive(2);
          }}
          active={active === 2}
        >
          Other contests
        </Button>
      </ButtonGroup>
    </Row>
  );
};
