import create from "zustand";
import { devtools } from "zustand/middleware";
import { readAllLocal } from "../utils/localStorage";

export interface UserInfo {
  token: string | null;
  nickname: string | null;
  id: string | null;
}

export interface UserCredit {
  label: number;
  score: number;
  modify: number;
  create: number;
  review: number;
}

export interface UserState {
  userInfo: UserInfo;
  updateUserInfo: (update: Partial<UserInfo>) => void;
  initUserInfo: () => void;
  clearUserInfo: () => void;

  /* ---------------------------- Handle User Score --------------------------- */
  userScore: UserCredit;
  updateUserScore: (update: Partial<UserCredit>) => void;

  // We use the number of query images to decide whether the treasure is found or not.
  // We set our own random number, and when the number of query images reaches the value of that number,
  // we assume that the user has found the treasure.
  /* -------------------------- Handle Treasure Bonus ------------------------- */
  collectedImgNum: number;
  treasureNum: number;
  updateCollectedImgNum: (update: number) => void;
  updateTreasureNum: (update: number) => void;
}

export const useUserStore = create<UserState>(
  devtools(
    (set) => ({
      userInfo: { token: null, id: null, nickname: null },
      updateUserInfo: (update) => {
        set(
          (state) => ({ ...state, userInfo: { ...state.userInfo, ...update } }),
          false,
          "UserState/updateUserInfo"
        );
      },
      initUserInfo: () => {
        set(
          (state) => {
            const result = readAllLocal();
            return { ...state, userInfo: result };
          },
          false,
          "UserState/initUserInfo"
        );
      },
      clearUserInfo: () => {
        set((state) => ({
          ...state,
          userInfo: { token: null, id: null, nickname: null },
        }));
      },

      /* ---------------------------- Handle User Score --------------------------- */
      userScore: {
        label: 0,
        score: 0,
        modify: 0,
        create: 0,
        review: 0,
      },
      updateUserScore: (update) => {
        set(
          (state) => ({
            ...state,
            userScore: { ...state.userScore, ...update },
          }),
          false,
          "UserState/userScore"
        );
      },

      /* -------------------------- Handle Treasure Bonus ------------------------- */
      collectedImgNum: 0,
      updateCollectedImgNum: (update) => {
        set(
          (state) => ({ ...state, collectedImgNum: Math.max(update, 0) }),
          false,
          "UserState/updateCollectedImgNum"
        );
      },
      treasureNum: Math.max(Math.floor(Math.random() * 50), 2), //Math.floor(Math.random() * 50)
      updateTreasureNum: (update) => {
        set(
          (state) => ({ ...state, treasureNum: update }),
          false,
          "UserState/updateTreasureNum"
        );
      },
    }),
    { name: "UserState" }
  )
);
