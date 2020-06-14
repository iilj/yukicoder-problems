import React from 'react';
import { DropdownMenu, DropdownMenuProps } from 'reactstrap';

export const WellPositionedDropdownMenu = (
  props: DropdownMenuProps
): JSX.Element => (
  <DropdownMenu
    style={{
      position: 'absolute',
      willChange: 'transform',
      top: '50px',
      left: '0px',
      transform: 'translate3d(0px, -65px, 0px)',
      maxHeight: 'calc(100vh - 65px)',
      overflowY: 'scroll',
    }}
  >
    {props.children}
  </DropdownMenu>
);
