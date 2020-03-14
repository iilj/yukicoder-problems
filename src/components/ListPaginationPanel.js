import React from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  PaginationLink,
} from 'reactstrap';

const range = (start, end) => Array.from({ length: end - start + 1 }, (v, k) => k + start);
const pageList = (currPage, pageStartIndex, totalPage) => {
  if (totalPage === 0) {
    return [];
  }
  if (totalPage <= 10) {
    return range(1, totalPage);
  }

  const pageNumbers = [currPage];
  let tmpExp = 1;
  while (true) {
    tmpExp *= 2;
    const tmpPageNumber = currPage - tmpExp + 1;
    if (tmpPageNumber < pageStartIndex) {
      break;
    }
    pageNumbers.unshift(tmpPageNumber);
  }
  if (pageNumbers[0] !== pageStartIndex) {
    pageNumbers.unshift(pageStartIndex);
  }

  tmpExp = 1;
  while (true) {
    tmpExp *= 2;
    const tmpPageNumber = currPage + tmpExp - 1;
    if (tmpPageNumber > totalPage) {
      break;
    }
    pageNumbers.push(tmpPageNumber);
  }
  if (pageNumbers.slice(-1)[0] !== totalPage) {
    pageNumbers.push(totalPage);
  }

  return pageNumbers;
};

export const ListPaginationPanel = (props) => {
  const pageNumbers = pageList(props.currPage, props.pageStartIndex, props.totalPages);

  return (
    <>
      <div className="col-md-2 col-xs-2 col-sm-2 col-lg-2">
        <UncontrolledDropdown className="react-bs-table-sizePerPage-dropdown">
          <DropdownToggle caret>{props.sizePerPage}</DropdownToggle>
          <DropdownMenu>
            {props.sizePerPageList.map((p) => (
              <DropdownItem key={p.text} onClick={() => props.changeSizePerPage(p.value)}>
                {p.text}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <div className="col-md-10 col-xs-10 col-sm-10 col-lg-10" style={{ display: 'block' }}>
        <ul
          className="react-bootstrap-table-page-btns-ul pagination"
          style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}
        >
          {pageNumbers.map((pageNumber) => {
            const className = `${pageNumber === props.currPage ? 'active ' : ''}page-item`;
            return (
              <li className={className} key={pageNumber} title={pageNumber.toString()}>
                <PaginationLink onClick={() => props.changePage(pageNumber)}>
                  {pageNumber}
                </PaginationLink>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};