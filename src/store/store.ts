import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import global from './global';

const reducer = combineReducers({
  global,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // 关闭redux序列化检测
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
