



const Stripe = (state = {customer: {name: ''}}, action) => {
  switch (action.type) {
    case 'GET_SESSION_SUCCESS':
      return {
        ...state,
        customer: action.payload,
      };    
    default:
      return state;
  }
};

export default Stripe;
