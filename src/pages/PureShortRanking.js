import React, { useEffect, useState } from 'react';
import {
  DropdownItem, DropdownToggle, Row, UncontrolledDropdown, ButtonGroup,
} from 'reactstrap';
import { Ranking } from '../components/Ranking';
import { WellPositionedDropdownMenu } from '../components/WellPositionedDropdownMenu';
import * as CachedApiClient from '../utils/CachedApiClient';

const initialUniversalState = {
  languages: [],
};

const initialUserState = {
  golferPureMap: {},
};

export const PureShortRanking = () => {
  const emptyLangId = '';
  const [langId, setLangId] = useState(emptyLangId);

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [userState, setUserState] = useState(initialUserState);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      const languages = await CachedApiClient.cachedLanguageArray();

      if (!unmounted) {
        setUniversalState({
          languages,
        });
      }
    };
    getUniversalInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [setUniversalState]);

  useEffect(() => {
    let unmounted = false;
    const getUserInfo = async () => {
      const golferPureMap = langId === emptyLangId
        ? await CachedApiClient.cachedGolferPureMap()
        : await CachedApiClient.cachedGolferPureMapLangMap(langId);

      if (!unmounted) {
        setUserState({
          golferPureMap,
        });
      }
    };
    getUserInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [langId, setUserState]);

  const { languages } = universalState;
  const { golferPureMap } = userState;

  const ranking = Object.keys(golferPureMap).reduce((ar, userName) => {
    ar.push({ name: userName, count: golferPureMap[userName].length });
    return ar;
  }, []);

  const languagesMap = languages.reduce((map, language) => {
    map[language.Id] = language;
    return map;
  }, {});

  return (
    <>
      <Row>
        <ButtonGroup className="mr-4">
          <UncontrolledDropdown>
            <DropdownToggle caret>
              {langId === emptyLangId ? 'Language' : languagesMap[langId].Name}
            </DropdownToggle>
            <WellPositionedDropdownMenu>
              <DropdownItem header>Language</DropdownItem>
              <DropdownItem key="All" onClick={() => setLangId(emptyLangId)}>
                All
              </DropdownItem>
              {languages.map((language) => (
                <DropdownItem key={language.Id} onClick={() => setLangId(language.Id)}>
                  {language.Name}
                </DropdownItem>
              ))}
            </WellPositionedDropdownMenu>
          </UncontrolledDropdown>
        </ButtonGroup>
      </Row>
      <Ranking title="Top Pure Golfers" ranking={ranking} />
    </>
  );
};
