import React from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
  Button,
  ButtonGroup,
} from 'reactstrap';
import dataFormat from 'dateformat';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangePicker.css';

import { range } from '../utils';

export const INITIAL_FROM_DATE = new Date('2014/07/20');
export const INITIAL_TO_DATE = new Date(new Date().setHours(23, 59, 59, 999));
const years = range(2014, INITIAL_TO_DATE.getFullYear());
const months = range(0, 11);

const DatePickerCustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => (
  <>
    <Button
      outline
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
      className="next-prev-month"
    >
      &lt;
    </Button>
    {' '}
    <UncontrolledButtonDropdown>
      <DropdownToggle caret className="year-month-dropdown-toggle">
        {date.getFullYear()}
      </DropdownToggle>
      <DropdownMenu>
        {years.map((year) => (
          <DropdownItem key={year} onClick={() => changeYear(year)}>
            {year}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledButtonDropdown>
    {' / '}
    <UncontrolledButtonDropdown>
      <DropdownToggle caret className="year-month-dropdown-toggle">
        {date.getMonth() + 1}
      </DropdownToggle>
      <DropdownMenu>
        {months.map((month) => (
          <DropdownItem key={month} onClick={() => changeMonth(month)}>
            {month + 1}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledButtonDropdown>
    {' '}
    <Button
      outline
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
      className="next-prev-month"
    >
      &gt;
    </Button>
  </>
);

export const DateRangePicker = (props) => {
  const {
    fromDate, toDate, onFromDateChange, onToDateChange, minDate, maxDate,
  } = props;

  const popperModifiers = {
    flip: {
      enabled: false,
    },
    preventOverflow: {
      enabled: true,
      escapeWithReference: false,
    },
  };

  return (
    <ButtonGroup className="mr-4">
      <UncontrolledButtonDropdown>
        <DatePicker
          selected={fromDate}
          customInput={(
            <DropdownToggle caret>
              {fromDate.getTime() === minDate.getTime()
                ? 'Date From'
                : dataFormat(fromDate, 'yyyy/mm/dd -')}
            </DropdownToggle>
          )}
          onChange={onFromDateChange}
          selectsStart
          minDate={minDate}
          maxDate={INITIAL_TO_DATE}
          startDate={fromDate}
          endDate={toDate}
          todayButton="Today"
          popperPlacement="bottom-end"
          popperModifiers={popperModifiers}
          renderCustomHeader={(params) => <DatePickerCustomHeader {...params} />}
        />
      </UncontrolledButtonDropdown>
      <UncontrolledButtonDropdown>
        <DatePicker
          selected={toDate}
          customInput={(
            <DropdownToggle caret>
              {toDate.getTime() === maxDate.getTime()
                ? 'Date To'
                : dataFormat(toDate, '- yyyy/mm/dd')}
            </DropdownToggle>
          )}
          onChange={onToDateChange}
          selectsEnd
          minDate={fromDate}
          maxDate={maxDate}
          startDate={fromDate}
          endDate={toDate}
          todayButton="Today"
          popperPlacement="bottom-end"
          popperModifiers={popperModifiers}
          renderCustomHeader={(params) => <DatePickerCustomHeader {...params} />}
        />
      </UncontrolledButtonDropdown>
    </ButtonGroup>
  );
};
