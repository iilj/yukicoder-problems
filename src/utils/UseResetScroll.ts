import React from 'react';
import { useLocation, useNavigate } from 'react-router';

export const useResetScroll = (): void => {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();

  const updateState = React.useCallback(() => {
    navigate(pathname, {
      state: { ...state, scrolled: true },
      replace: true,
    });
    window.scrollTo(0, 0);
  }, [pathname, state, navigate]);

  React.useLayoutEffect(() => {
    // if (state && ((state as { scrolled: boolean }).scrolled))
    updateState();
  }, [state, updateState]);
};
