import React, { useState } from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
  SubMenu,
} from 'react-contextmenu';
import copy from 'copy-to-clipboard';
import { ProblemDetailModal } from './ProblemDetailModal';
import {
  formatProblemUrl,
  formatProblemSubmissionsUrl,
  formatProblemStatisticsUrl,
  formatProblemEditorialUrl,
  formatContestUrl,
  formatContestLeaderboardUrl,
} from '../utils/Url';
import './react-contextmenu.css';
import { MergedProblem } from '../interfaces/MergedProblem';
import { ProblemNo } from '../interfaces/Problem';
import { ProblemLink } from './ProblemLink';
import { ContestId } from '../interfaces/Contest';

interface Props {
  mergedProblem: MergedProblem;
  problemTitle: string;
  showDifficultyLevel: boolean;
  id?: string;
}

export const ProblemLinkWithContextMenu: React.FC<Props> = (props) => {
  const { mergedProblem, problemTitle, showDifficultyLevel, id } = props;
  const contextMenuId = `contextmenu_problem_${mergedProblem.ProblemId}`;

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const openUrl = (url: string): void => {
    void window.open(url, '_blank');
  };
  const handleMenuItemClick = (
    _event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
    data: { item: string; handler: (item: string) => void }
  ): void => void data.handler(data.item);

  return (
    <>
      <ContextMenuTrigger id={contextMenuId} holdToDisplay={-1}>
        <ProblemLink
          problemNo={mergedProblem.No as ProblemNo}
          problemTitle={problemTitle}
          level={mergedProblem.Level}
          showDifficultyLevel={showDifficultyLevel}
          id={id}
        />
      </ContextMenuTrigger>

      <ContextMenu id={contextMenuId}>
        <SubMenu title="Open">
          <MenuItem
            data={{
              item: formatProblemUrl(mergedProblem.No as ProblemNo),
              handler: openUrl,
            }}
            onClick={handleMenuItemClick}
          >
            Problem...
          </MenuItem>
          <MenuItem
            data={{
              item: formatProblemSubmissionsUrl(mergedProblem.No as ProblemNo),
              handler: openUrl,
            }}
            onClick={handleMenuItemClick}
          >
            Submissions...
          </MenuItem>
          <MenuItem
            data={{
              item: formatProblemStatisticsUrl(mergedProblem.No as ProblemNo),
              handler: openUrl,
            }}
            onClick={handleMenuItemClick}
          >
            Statistics...
          </MenuItem>
          <MenuItem
            data={{
              item: formatProblemEditorialUrl(mergedProblem.No as ProblemNo),
              handler: openUrl,
            }}
            onClick={handleMenuItemClick}
          >
            Editorial...
          </MenuItem>
          <MenuItem
            data={{
              item: formatContestUrl(mergedProblem.Contest?.Id as ContestId),
              handler: openUrl,
            }}
            onClick={handleMenuItemClick}
          >
            Contest...
          </MenuItem>
          <MenuItem
            data={{
              item: formatContestLeaderboardUrl(
                mergedProblem.Contest?.Id as ContestId
              ),
              handler: openUrl,
            }}
            onClick={handleMenuItemClick}
          >
            Contest Leaderboard...
          </MenuItem>
        </SubMenu>
        <SubMenu title="Copy">
          <MenuItem
            data={{ item: mergedProblem.Title, handler: copy }}
            onClick={handleMenuItemClick}
          >
            Problem Title
          </MenuItem>
          <MenuItem
            data={{
              item: formatProblemUrl(mergedProblem.No as ProblemNo),
              handler: copy,
            }}
            onClick={handleMenuItemClick}
          >
            Problem URL
          </MenuItem>
        </SubMenu>
        <MenuItem divider />
        <MenuItem onClick={() => setShowDetailsModal(true)}>Details</MenuItem>
      </ContextMenu>

      <ProblemDetailModal
        show={showDetailsModal}
        handleClose={() => setShowDetailsModal(false)}
        mergedProblem={mergedProblem}
        showDifficultyLevel={showDifficultyLevel}
      />
    </>
  );
};
