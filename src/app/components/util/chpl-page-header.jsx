import React, { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Container,
  Typography,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { node, oneOf, string } from 'prop-types';

import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { palette } from 'themes';

function ChplPageHeader({
  text,
  subtitle = null,
  actions = null,
  titleAdornment = null,
  maxWidth = 'lg',
}) {
  const [expanded, setExpanded] = useState(true);
  const { analytics } = useAnalyticsContext();

  return (
    <Box position="relative" boxShadow={2} bgcolor={palette.white} p={8}>
      <Container maxWidth={maxWidth}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap="16px">
          <Box display="flex" alignItems="center" gap="4px">
            <Typography variant="h1">
              { text }
            </Typography>
            { titleAdornment }
          </Box>
          { (actions || subtitle)
            && (
              <Box display="flex" alignItems="center" flexWrap="wrap" gap="8px">
                { actions }
                { subtitle
                  && (
                    <Button
                      color="primary"
                      style={{ fontSize: '1rem' }}
                      onClick={() => {
                        const next = !expanded;
                        setExpanded(next);
                        eventTrack({
                          ...analytics,
                          event: next ? 'Show Page Header Information' : 'Hide Page Header Information',
                        });
                      }}
                      endIcon={expanded ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
                    >
                      { expanded ? 'Hide Details' : 'Show Details' }
                    </Button>
                  )}
              </Box>
            )}
        </Box>
        { subtitle
          && (
            <Collapse in={expanded}>
              <Box mt={2}>
                <Typography variant="body1" style={{ color: palette.greyDark }} component="div">
                  { subtitle }
                </Typography>
              </Box>
            </Collapse>
          )}
      </Container>
    </Box>
  );
}

export default ChplPageHeader;

ChplPageHeader.propTypes = {
  text: string.isRequired,
  subtitle: node,
  actions: node,
  titleAdornment: node,
  maxWidth: oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
};
