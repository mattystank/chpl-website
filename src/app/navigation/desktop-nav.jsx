import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  ClickAwayListener,
  Popover,
  makeStyles,
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { func } from 'prop-types';

import {
  developerGuideRoles,
  getResourceItems,
  shortcutItems,
} from './navigation-menu-items';

import ChplCmsDisplay from 'components/cms-widget/cms-display';
import ChplCompareDisplay from 'components/compare-widget/compare-display';
import { ChplLink } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  whiteButton: {
    color: '#fff!important',
    textTransform: 'capitalize!important',
    '&:hover': {
      backgroundColor: `${palette.primaryDark}!important`,
      color: '#fff!important',
    },
    '&[aria-expanded="true"]': {
      backgroundColor: `${palette.white}!important`,
      color: `${palette.greyDark}!important`,
      fontWeight: 'bold',
    },
  },
  menuPaper: {
    marginTop: '8px',
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    backgroundColor: palette.white,
    borderRadius: '4px',
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    zIndex: 1300,
    minWidth: '160px',
    padding: '8px 0',
  },
  dropdownRight: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    backgroundColor: palette.white,
    borderRadius: '4px',
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    zIndex: 1300,
    minWidth: '160px',
    padding: '8px 0',
  },
  dropdownItem: {
    padding: '6px 16px',
    whiteSpace: 'nowrap',
    '& span': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    '& a': {
      color: `${palette.primary} !important`,
    },
  },
});

function ChplDesktopNav({
  onHomeClick,
  onSearchClick,
}) {
  const $rootScope = getAngularService('$rootScope');
  const analytics = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const cmsButtonRef = useRef(null);
  const compareButtonRef = useRef(null);
  const resourcesButtonRef = useRef(null);
  const shortcutsButtonRef = useRef(null);
  const [cmsAnchorEl, setCmsAnchorEl] = useState(null);
  const [compareAnchorEl, setCompareAnchorEl] = useState(null);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const resourceItems = getResourceItems({
    includeDeveloperGuide: hasAnyRole(developerGuideRoles),
  });

  const classes = useStyles();

  // These widgets can be opened by click handlers and root-scope broadcasts.
  // When that happens during a render/layout transition, ref.current may not be a usable anchor.
  // We only return anchors that are mounted and visible to avoid invalid anchorEl warnings.
  const getVisibleAnchor = (ref) => {
    const el = ref.current;
    if (!el || !el.isConnected || el.offsetParent === null) {
      return null;
    }
    return el;
  };

  useEffect(() => {
    const deregisterShowCmsWidget = $rootScope.$on('ShowCmsWidget', () => {
      const anchor = getVisibleAnchor(cmsButtonRef);
      if (!anchor) {
        return;
      }
      window.dispatchEvent(new CustomEvent('close-all-nav-overlays', { detail: { source: 'desktop-nav' } }));
      setCompareAnchorEl(null);
      setResourcesOpen(false);
      setShortcutsOpen(false);
      setCmsAnchorEl(anchor);
    });
    const deregisterHideCmsWidget = $rootScope.$on('HideCmsWidget', () => {
      setCmsAnchorEl(null);
    });
    const deregisterShowCompareWidget = $rootScope.$on('ShowCompareWidget', () => {
      const anchor = getVisibleAnchor(compareButtonRef);
      if (!anchor) {
        return;
      }
      window.dispatchEvent(new CustomEvent('close-all-nav-overlays', { detail: { source: 'desktop-nav' } }));
      setCmsAnchorEl(null); 
      setResourcesOpen(false);
      setShortcutsOpen(false);
      setCompareAnchorEl(anchor);
    });
    const deregisterHideCompareWidget = $rootScope.$on('HideCompareWidget', () => {
      setCompareAnchorEl(null);
    });
    return () => {
      deregisterShowCmsWidget();
      deregisterHideCmsWidget();
      deregisterShowCompareWidget();
      deregisterHideCompareWidget();
    };
  }, [$rootScope]);

  const closeAllNavOverlays = () => {
    setCmsAnchorEl(null);
    setCompareAnchorEl(null);
    setResourcesOpen(false);
    setShortcutsOpen(false);
  };

  useEffect(() => {
    const handleCloseAll = (e) => {
      if (e.detail?.source !== 'desktop-nav') {
        closeAllNavOverlays();
      }
    };
    window.addEventListener('close-all-nav-overlays', handleCloseAll);
    return () => window.removeEventListener('close-all-nav-overlays', handleCloseAll);
  }, []);

  const toggleCmsWidget = () => {
    if (cmsAnchorEl) {
      setCmsAnchorEl(null);
      return;
    }
    const anchor = getVisibleAnchor(cmsButtonRef);
    if (!anchor) {
      return;
    }
    window.dispatchEvent(new CustomEvent('close-all-nav-overlays', { detail: { source: 'desktop-nav' } }));
    closeAllNavOverlays();
    setCmsAnchorEl(anchor);
  };

  const closeCmsWidget = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setCmsAnchorEl(null);
  };

  const toggleCompareWidget = () => {
    if (compareAnchorEl) {
      setCompareAnchorEl(null);
      return;
    }

    // Skip opening if the compare button is not currently a valid visible anchor.
    const anchor = getVisibleAnchor(compareButtonRef);
    if (!anchor) {
      return;
    }
    window.dispatchEvent(new CustomEvent('close-all-nav-overlays', { detail: { source: 'desktop-nav' } }));
    closeAllNavOverlays();
    setCompareAnchorEl(anchor);
  };

  const closeCompareWidget = (event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }
    setCompareAnchorEl(null);
  };


  const toggleResources = () => {
    setResourcesOpen((prev) => {
      const next = !prev;
      if (next) {
        window.dispatchEvent(new CustomEvent('close-all-nav-overlays', { detail: { source: 'desktop-nav' } }));
        closeAllNavOverlays();
      }
      return next;
    });
  };

  const closeResources = () => {
    setResourcesOpen(false);
  };

  const toggleShortcuts = () => {
    setShortcutsOpen((prev) => {
      const next = !prev;
      if (next) {
        window.dispatchEvent(new CustomEvent('close-all-nav-overlays', { detail: { source: 'desktop-nav' } }));
        closeAllNavOverlays();
      }
      return next;
    });
  };

  const closeShortcuts = () => {
    setShortcutsOpen(false);
  };

  const getItemAnalytics = (item) => ({
    ...analytics,
    event: item.analyticsEvent,
    category: item.analyticsCategory ?? 'Navigation',
  });

  const getDownloadIcon = (item) => {
    if (!item.showDownloadIcon) {
      return undefined;
    }
    if (item.primaryIcon) {
      return <CloudDownloadIcon color="primary" />;
    }
    return <CloudDownloadIcon />;
  };

  return (
    <Box className={classes.navContainer}>
      <Button
        onClick={() => {
          closeAllNavOverlays();
          onHomeClick();
        }}
        className={classes.whiteButton}
      >
        Home
      </Button>
      <Button
        onClick={() => {
          closeAllNavOverlays();
          onSearchClick();
        }}
        className={classes.whiteButton}
      >
        Search CHPL
      </Button>
      <Button
        ref={cmsButtonRef}
        onClick={toggleCmsWidget}
        aria-expanded={!!cmsAnchorEl}
        className={classes.whiteButton}
      >
        CMS ID Creator
      </Button>
      {/*
        Use Popover (not Menu) because this is a custom widget panel, not a menu list.
        Menu tries to apply menu semantics/focus behavior that caused ref warnings with this content.
      */}
      <Popover
        anchorEl={cmsAnchorEl}
        open={!!cmsAnchorEl}
        onClose={closeCmsWidget}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableScrollLock
        hideBackdrop
        style={{ pointerEvents: 'none' }}
        PaperProps={{
          className: classes.menuPaper,
          style: {
            width: '400px',
            pointerEvents: 'auto',
          },
        }}
      >
        <ChplCmsDisplay />
      </Popover>
      <Button
        ref={compareButtonRef}
        onClick={toggleCompareWidget}
        aria-expanded={!!compareAnchorEl}
        className={classes.whiteButton}
        color="inherit"
      >
        Compare Products
      </Button>
      <Popover
        anchorEl={compareAnchorEl}
        open={!!compareAnchorEl}
        onClose={closeCompareWidget}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableScrollLock
        hideBackdrop
        style={{ pointerEvents: 'none' }}
        PaperProps={{
          className: classes.menuPaper,
          style: {
            width: '400px',
            pointerEvents: 'auto',
          },
        }}
      >
        <ChplCompareDisplay />
      </Popover>
      <ClickAwayListener onClickAway={closeResources}>
        <Box className={classes.dropdownWrapper}>
          <Button
            ref={resourcesButtonRef}
            onClick={toggleResources}
            aria-expanded={resourcesOpen}
            className={classes.whiteButton}
          >
            CHPL Resources
          </Button>
          { resourcesOpen && (
            <Box className={classes.dropdown} role="menu">
              { resourceItems.map((item) => (
                <Box
                  key={item.key}
                  className={classes.dropdownItem}
                  onClick={closeResources}
                  role="menuitem"
                >
                  <ChplLink
                    href={item.href}
                    text={item.text}
                    analytics={getItemAnalytics(item)}
                    external={false}
                    router={item.router}
                    icon={getDownloadIcon(item)}
                    indicateOnHover
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </ClickAwayListener>
      <ClickAwayListener onClickAway={closeShortcuts}>
        <Box className={classes.dropdownWrapper}>
          <Button
            ref={shortcutsButtonRef}
            onClick={toggleShortcuts}
            aria-expanded={shortcutsOpen}
            className={classes.whiteButton}
          >
            Shortcuts
          </Button>
          { shortcutsOpen && (
            <Box className={classes.dropdownRight} role="menu">
              { shortcutItems.map((item) => (
                <Box
                  key={item.key}
                  className={classes.dropdownItem}
                  onClick={closeShortcuts}
                  role="menuitem"
                >
                  <ChplLink
                    href={item.href}
                    text={item.text}
                    analytics={getItemAnalytics(item)}
                    external={false}
                    router={item.router}
                    indicateOnHover
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </ClickAwayListener>
    </Box>
  );
}

export default ChplDesktopNav;

ChplDesktopNav.propTypes = {
  onHomeClick: func.isRequired,
  onSearchClick: func.isRequired,
};
