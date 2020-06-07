import React, { useState } from 'react';
import { NavLink as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
  Input,
  Button,
  FormGroup,
} from 'reactstrap';

const extractPageKind = (pathname: string) => {
  if (pathname.match(/^\/user/)) {
    return 'user';
  }
  if (pathname.match(/^\/list/)) {
    return 'list';
  }
  if (pathname.match(/^\/table/)) {
    return 'table';
  }
  return undefined;
};

const extractParams = (pathname: string) => {
  const params = pathname.split('/');
  const param = params.length >= 4 ? params[2] : '';
  const user = params.length >= 4 ? decodeURIComponent(params[3]) : '';
  return { param, user };
};

const generatePath = (kind: string, param: string, user: string) => (user && user !== '' ? `/${kind}/${param}/${encodeURIComponent(user)}` : `/${kind}/`);

export const NavigationBar = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const initialPageKind = extractPageKind(pathname);
  const initialState = extractParams(pathname);

  const [pageKind, setPageKind] = useState(initialPageKind ?? 'table');
  const [param, setParam] = useState(initialState.param || 'name');
  const [user, setUser] = useState(initialState.user || '');
  const [isOpen, setIsOpen] = useState(false);

  const submit = (nextKind: string) => {
    navigate(generatePath(nextKind, param, user));
    setPageKind(nextKind);
  };
  return (
    <Navbar color="light" light expand="lg" fixed="top">
      <NavbarBrand>yukicoder problems</NavbarBrand>
      <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <Form
            inline
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <UncontrolledDropdown>
              <DropdownToggle caret>{param}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem key="name" onClick={() => setParam('name')}>
                  name
                </DropdownItem>
                <DropdownItem key="twitter" onClick={() => setParam('twitter')}>
                  twitter
                </DropdownItem>
                <DropdownItem key="id" onClick={() => setParam('id')}>
                  id
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Input
                style={{ width: '150px' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && pageKind !== null) {
                    submit(pageKind);
                  }
                }}
                value={user}
                type="text"
                name="user"
                id="user"
                placeholder="name|twitter|id"
                onChange={(e) => setUser(e.target.value)}
              />
            </FormGroup>
            <Button
              className="mb-2 mr-sm-2 mb-sm-0"
              tag={RouterLink}
              to={generatePath('table', param, user)}
              onClick={() => {
                submit('table');
              }}
            >
              Table
            </Button>
            <Button
              className="mb-2 mr-sm-2 mb-sm-0"
              tag={RouterLink}
              to={generatePath('list', param, user)}
              onClick={() => {
                submit('list');
              }}
            >
              List
            </Button>
            <Button
              className="mb-2 mr-sm-2 mb-sm-0"
              disabled={!user || user.length === 0}
              tag={RouterLink}
              to={generatePath('user', param, user)}
              onClick={() => {
                submit('user');
              }}
            >
              User Page
            </Button>
          </Form>
        </Nav>

        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Rankings
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem tag={RouterLink} to="/short">
                Shortest Submissions
              </DropdownItem>
              <DropdownItem tag={RouterLink} to="/pureshort">
                Pure Shortest Submissions
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>

        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Links
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem tag="a" href="https://yukicoder.me/" target="_blank">
                yukicoder
              </DropdownItem>
              <DropdownItem tag="a" href="https://kenkoooo.com/atcoder/" target="_blank">
                AtCoder Problems
              </DropdownItem>
              <DropdownItem
                tag="a"
                href="https://github.com/iilj/yukicoder-problems"
                target="_blank"
              >
                GitHub
              </DropdownItem>
              <DropdownItem tag="a" href="https://twitter.com/iiljj" target="_blank">
                @iiljj
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  );
};
