import React, { useEffect } from 'react';
import { string } from 'prop-types';
import { useDispatch } from 'react-redux';

import ChplLogin from 'components/login/login';
import { setLoginState } from 'components/login/userInfo.slice';
import { ChplPageBody, ChplPageHeader } from 'components/util';
import { goToState } from 'services/navigation.service';

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
    <>
      <ChplPageHeader text="Forgot Password" maxWidth="xs" />
      <ChplPageBody maxWidth="xs">
        <ChplLogin
          dispatch={handleLogin}
          uuid={uuid}
        />
      </ChplPageBody>
    </>
  );
}

export default ChplForgotPassword;

ChplForgotPassword.propTypes = {
  uuid: string.isRequired,
};
