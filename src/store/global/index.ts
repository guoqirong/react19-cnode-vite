import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { getLocalStorage } from '@/utils';

const namespace = 'global';

export enum ELayout {
  mix = 1,
  fullPage,
}

export interface IGlobalState {
  token?: string;
  simpleUserData: simpleUserDataType;
  userData: userDataType;
  isLoading: boolean;
  listParm: string;
}

interface simpleUserDataType {
  id?: string;
  loginName?: string;
  avatar_url?: string;
}

export interface userDataType {
  avatar_url?: string;
  create_at?: string;
  githubUsername?: string;
  loginName?: string;
  loginname?: string;
  recent_replies?: recentDataItemType[];
  recent_topics?: recentDataItemType[];
  score?: number;
}

export interface recentDataItemType {
  author: {
    avatar_url: string;
    loginName: string;
  };
  id: string;
  last_reply_at: string;
  title: string;
}

const initialState: IGlobalState = {
  token: getLocalStorage('token') ?? undefined,
  simpleUserData: {
    loginName: getLocalStorage('loginName') ?? undefined,
  },
  userData: {},
  isLoading: false,
  listParm: '',
};

// 创建带有命名空间的reducer
const globalSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    updateToken(state, { payload }: { payload: string }) {
      return {
        ...state,
        token: payload,
      };
    },
    updateSimpleUserData(state, { payload }: { payload: simpleUserDataType }) {
      return {
        ...state,
        simpleUserData: payload,
      };
    },
    updateUserData(state, { payload }: { payload: userDataType }) {
      return {
        ...state,
        userData: payload,
      };
    },
    updateLoading(state, { payload }: { payload: boolean }) {
      return {
        ...state,
        isLoading: payload,
      };
    },
    updateListParm(state, { payload }: { payload: string }) {
      return {
        ...state,
        listParm: payload,
      };
    },
  },
  extraReducers: () => {},
});

export const selectGlobal = (state: RootState) => state.global;

export const { updateToken, updateSimpleUserData, updateUserData, updateLoading, updateListParm } = globalSlice.actions;

export default globalSlice.reducer;
