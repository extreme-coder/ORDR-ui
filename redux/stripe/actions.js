import { createAction } from '@reduxjs/toolkit';

export const createSession = (data) => async (dispatch) => {
  const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/create_checkout_session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (response.ok) {
    const session = await response.json();
    let stripeKey = process.env.REACT_APP_STRIPE_KEY;
    var stripe = window.Stripe(stripeKey);

    stripe
      .redirectToCheckout({
        sessionId: session.sessionId,
      })
      .then({});

    dispatch(createSessionSuccess(session));
  }
};

export const createSessionSuccess = createAction('CREATE_SESSION_SUCCESS');

export const getSession = (data, navigate) => async (dispatch) => {
  const response = await fetch(`${process.env.REACT_APP_API_HOST}/api/checkout_session?sessionId=${data}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (response.ok) {
    const session = await response.json();
    if(session.verified) { 
      dispatch(getSessionSuccess(session));
    } else {
      navigate('/payment-failure');
    }
  } else {
    // Handle error here
    console.error('Error getting session');
    navigate('/payment-failure');
  }
};

export const getSessionSuccess = createAction('GET_SESSION_SUCCESS');
