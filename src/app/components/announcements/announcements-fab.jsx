import React, { useEffect, useState } from 'react';
import {
  Badge,
  CardHeader,
  IconButton,
  Menu,
  makeStyles,
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

import { useFetchAnnouncements } from 'api/announcements';
import { palette } from 'themes';

const useStyles = makeStyles({
  announcementHeader: {
    backgroundColor: palette.white,
    padding: '16px',
    fontWeight: 'bold',
    color: palette.black,
  },
  badge: {
    border: `2px solid ${palette.primaryDark}`,
  },
});

function ChplAnnouncementsFab() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const classes = useStyles();

  const { data, isLoading, isSuccess } = useFetchAnnouncements({ getFuture: false });

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setAnnouncements(data.sort((a, b) => a.startDate - b.startDate));
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    const handleCloseAll = (e) => {
      if (e.detail?.source !== 'announcements') {
        setAnchorEl(null);
      }
    };
    window.addEventListener('close-all-nav-overlays', handleCloseAll);
    return () => window.removeEventListener('close-all-nav-overlays', handleCloseAll);
  }, []);

  const handleToggle = (event) => {
    if (!anchorEl) {
      window.dispatchEvent(new CustomEvent('close-all-nav-overlays', { detail: { source: 'announcements' } }));
    }
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  return (
    <>
      <IconButton
        onClick={handleToggle}
        aria-label="Show announcements"
        style={{ color: palette.white }}
      >
        <Badge
          badgeContent={announcements.length}
          color="primary"
          overlap="rectangular"
          classes={{ badge: classes.badge }}
        >
          <NotificationsIcon style={{ fontSize: 18 }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleToggle}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        disableScrollLock
        PaperProps={{
          style: {
            width: '325px',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 100px)',
          },
        }}
      >
        <CardHeader
          fontWeight="bold"
          className={classes.announcementHeader}
          title={`Announcement${announcements.length !== 1 ? 's' : ''}`}
        />
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {announcements.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', padding: '32px 16px' }}>
              <p style={{ fontFamily: 'inherit', fontSize: 'inherit', margin: 0 }}>No current announcements</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {announcements.map((announcement, index) => (
                <div
                  key={announcement.id || index}
                  style={{
                    padding: '16px', wordWrap: 'break-word', whiteSpace: 'pre-wrap', borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  <h4 style={{ fontFamily: 'inherit', fontSize: 'inherit', margin: 0 }}>
                    <strong>{announcement.title}</strong>
                  </h4>
                  {announcement.text && (
                    <span>{announcement.text}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Menu>
    </>
  );
}

export default ChplAnnouncementsFab;
