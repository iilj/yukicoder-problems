import React, { useState } from 'react';
import {
  DropdownItem, DropdownToggle, Row, UncontrolledDropdown, ButtonGroup,
} from 'reactstrap';
import { Ranking } from '../components/Ranking';
import { WellPositionedDropdownMenu } from '../components/WellPositionedDropdownMenu';
import * as CachedApiClient from '../utils/CachedApiClient';

export const PureShortRanking = () => {
  const emptyLangId = '';

  const [loadStarted, setLoadStarted] = useState(false);
  const [loadStartedLangId, setLoadStartedLangId] = useState(undefined);
  const [langId, setLangId] = useState(emptyLangId);
  const [languages, setLanguages] = useState([]);
  const [golferPureMap, setGolferPureMap] = useState({});

  if (!loadStarted) {
    setLoadStarted(true);
    CachedApiClient.cachedLanguageArray().then((ar) => setLanguages(ar));
  }
  if (loadStartedLangId !== langId) {
    setLoadStartedLangId(langId);
    if (langId === emptyLangId) CachedApiClient.cachedGolferPureMap().then((map) => setGolferPureMap(map));
    else CachedApiClient.cachedGolferPureMapLangMap(langId).then((map) => setGolferPureMap(map));
  }

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
