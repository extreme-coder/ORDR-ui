import { isRejectedWithValue } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {       
    if(action.payload.status === 401) {
      //redirect to login
      window.location = '/login'
    } else {
      toast.error(action.payload.data.error.message)
    }
  }
  return next(action)
}