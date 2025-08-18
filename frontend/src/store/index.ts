import { configureStore, combineReducers } from '@reduxjs/toolkit';
import apiSlice from '@/store/apiSlice';
import chatSlice from '@/store/chatSlice';

export const resetState = () => ({
  type: 'RESET_STATE',
});


const combinedReducers = combineReducers({
    api: apiSlice,
    chat: chatSlice,
});


const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STATE') {
    // Reset to initial state by setting state to undefined
    state = undefined; // Reset all slices to their initial states
  }
  return combinedReducers(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
