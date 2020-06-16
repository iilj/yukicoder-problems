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
import Popper from 'popper.js';

import { range } from '../utils';

export const INITIAL_FROM_DATE = new Date('2014/07/20');
export const INITIAL_TO_DATE = new Date(new Date().setHours(23, 59, 59, 999));

interface DatePickerCustomHeaderProps {
  minDate: Date;
  maxDate: Date;
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

const DatePickerCustomHeader: React.FC<DatePickerCustomHeaderProps> = (
  params
) => {
  const {
    minDate,
    maxDate,
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  } = params;
  const years = range(minDate.getFullYear(), maxDate.getFullYear());
  const months = range(0, 11);
  return (
    <>
      <Button
        outline
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="next-prev-month"
      >
        &lt;
      </Button>{' '}
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
      </UncontrolledButtonDropdown>{' '}
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
};

interface Props {
  fromDate: Date;
  toDate: Date;
  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;
  minDate: Date;
  maxDate: Date;
}

export const DateRangePicker: React.FC<Props> = (props) => {
  const {
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    minDate,
    maxDate,
  } = props;

  const popperModifiers = {
    flip: {
      enabled: false,
    },
    preventOverflow: {
      enabled: true,
      escapeWithReference: false,
    },
  } as Popper.Modifiers;

  return (
    <ButtonGroup className="mr-4">
      <UncontrolledButtonDropdown>
        <DatePicker
          selected={fromDate}
          customInput={
            <DropdownToggle caret>
              {fromDate.getTime() === minDate.getTime()
                ? 'Date From'
                : dataFormat(fromDate, 'yyyy/mm/dd -')}
            </DropdownToggle>
          }
          onChange={onFromDateChange}
          selectsStart
          minDate={minDate}
          maxDate={INITIAL_TO_DATE}
          startDate={fromDate}
          endDate={toDate}
          todayButton="Today"
          popperPlacement="bottom-end"
          popperModifiers={popperModifiers}
          renderCustomHeader={(params) => (
            <DatePickerCustomHeader
              minDate={minDate}
              maxDate={INITIAL_TO_DATE}
              {...params}
            />
          )}
        />
      </UncontrolledButtonDropdown>
      <UncontrolledButtonDropdown>
        <DatePicker
          selected={toDate}
          customInput={
            <DropdownToggle caret>
              {toDate.getTime() === maxDate.getTime()
                ? 'Date To'
                : dataFormat(toDate, '- yyyy/mm/dd')}
            </DropdownToggle>
          }
          onChange={onToDateChange}
          selectsEnd
          minDate={fromDate}
          maxDate={maxDate}
          startDate={fromDate}
          endDate={toDate}
          todayButton="Today"
          popperPlacement="bottom-end"
          popperModifiers={popperModifiers}
          renderCustomHeader={(params) => (
            <DatePickerCustomHeader
              minDate={fromDate}
              maxDate={maxDate}
              {...params}
            />
          )}
        />
      </UncontrolledButtonDropdown>
    </ButtonGroup>
  );
};
