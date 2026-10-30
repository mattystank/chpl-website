import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { string } from 'prop-types';
import { useDispatch } from 'react-redux';

import ChplLogin from 'components/login/login';
import { setLoginState } from 'components/login/userInfo.slice';
import { goToState } from 'services/navigation.service';

const styles = {
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
    padding: '16px',
  },
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 136px)',
  },
};

function ChplForgotPassword({ uuid }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoginState('RESETFORGOTTENPASSWORD'));
  }, []);

  // the reset form hands off to sign in; once signed in, leave the reset page for the home page
  const handleLogin = (action) => {
    if (action === 'loggedIn') {
      goToState('search');
    }
  };

  return (
    <Box sx={styles.fixFooterSpacing}>
      <Container maxWidth="xs" sx={styles.content}>
        <Typography variant="h1">
          Forgot Password
        </Typography>
      </Container>
      <Container maxWidth="xs">
        <ChplLogin
          dispatch={handleLogin}
          uuid={uuid}
        />
      </Container>
    </Box>
  );
}

export default ChplForgotPassword;

ChplForgotPassword.propTypes = {
  uuid: string.isRequired,
};
