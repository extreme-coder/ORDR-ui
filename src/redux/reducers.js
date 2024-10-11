// @flow
import { combineReducers } from 'redux';

//import Layout from './layout/reducers';
import Game from './game/reducers';
import Stripe from './stripe/reducers';

export default (combineReducers({   
    Game,
    //Layout,
    Stripe
}));
