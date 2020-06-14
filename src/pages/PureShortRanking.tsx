import React, { useEffect, useState } from 'react';
import {
  DropdownItem,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
  ButtonGroup,
  Spinner,
} from 'reactstrap';
import { Ranking } from '../components/Ranking';
import { WellPositionedDropdownMenu } from '../components/WellPositionedDropdownMenu';
import * as TypedCachedApiClient from '../utils/TypedCachedApiClient';
import { Language, LangId } from '../interfaces/Language';
import { RankingProblem } from '../interfaces/RankingProblem';
import { UserName } from '../interfaces/User';

const initialUniversalState = {
  languages: [] as Language[],
};

const initialUserState = {
  golferPureMap: new Map<UserName, RankingProblem[]>(),
};

export const PureShortRanking = (): JSX.Element => {
  const emptyLangId = '';
  const [langId, setLangId] = useState<LangId>(emptyLangId);

  const [universalState, setUniversalState] = useState(initialUniversalState);
  const [userState, setUserState] = useState(initialUserState);
  const [universalStateLoaded, setUniversalStateLoaded] = useState(false);
  const [userStateLoaded, setUserStateLoaded] = useState(false);

  useEffect(() => {
    let unmounted = false;
    const getUniversalInfo = async () => {
      setUniversalStateLoaded(false);
      const languages = await TypedCachedApiClient.cachedLanguageArray();

      if (!unmounted) {
        setUniversalState({
          languages,
        });
        setUniversalStateLoaded(true);
      }
    };
    void getUniversalInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, []);

  useEffect(() => {
    let unmounted = false;
    const getUserInfo = async () => {
      setUserStateLoaded(false);
      const golferPureMap =
        langId === emptyLangId
          ? await TypedCachedApiClient.cachedGolferPureMap()
          : await TypedCachedApiClient.cachedGolferPureMapLangMap(langId);

      if (!unmounted) {
        setUserState({
          golferPureMap,
        });
        setUserStateLoaded(true);
      }
    };
    void getUserInfo();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [langId]);

  const { languages } = universalState;
  const { golferPureMap } = userState;

  const ranking = [] as { name: UserName; count: number }[];
  golferPureMap.forEach((rankingProblems, userName) => {
    ranking.push({ name: userName, count: rankingProblems.length });
  });

  const languagesMap = languages.reduce(
    (map, language) => map.set(language.Id, language),
    new Map<LangId, Language>()
  );

  return (
    <>
      {userStateLoaded ? (
        <></>
      ) : (
        <Spinner
          style={{
            width: '3rem',
            height: '3rem',
            position: 'fixed',
            right: '10px',
            bottom: '10px',
          }}
        />
      )}
      <Row>
        <ButtonGroup className="mr-4">
          <UncontrolledDropdown>
            <DropdownToggle caret>
              {langId === emptyLangId
                ? 'Language'
                : (languagesMap.get(langId) as Language).Name}
            </DropdownToggle>
            <WellPositionedDropdownMenu>
              <DropdownItem header>Language</DropdownItem>
              <DropdownItem key="All" onClick={() => setLangId(emptyLangId)}>
                All
              </DropdownItem>
              {languages.map((language) => (
                <DropdownItem
                  key={language.Id}
                  onClick={() => setLangId(language.Id)}
                >
                  {language.Name}
                </DropdownItem>
              ))}
            </WellPositionedDropdownMenu>
          </UncontrolledDropdown>
        </ButtonGroup>
      </Row>
      <Ranking
        title="Top Pure Golfers"
        ranking={ranking}
        universalStateLoaded={universalStateLoaded}
      />
    </>
  );
};
