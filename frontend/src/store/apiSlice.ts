import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { availableApis } from "@/config/api";

interface ApiState {
  orderAPIs: string[];
  activeApis: string[];
}

const initialState: ApiState = {
    orderAPIs: availableApis.map(api => api.id),
    activeApis: [],
};


export const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    toggleApi: (state, action: PayloadAction<string>) => {
      if (state.activeApis.includes(action.payload)) {
        state.activeApis = state.activeApis.filter(id => id !== action.payload);
      } else {
        state.activeApis.push(action.payload);
      }
    },
    reorderApis(state, action: PayloadAction<string[]>) {
      state.orderAPIs = action.payload;
    },
  },
});

export const { toggleApi, reorderApis } = apiSlice.actions;
export default apiSlice.reducer;
