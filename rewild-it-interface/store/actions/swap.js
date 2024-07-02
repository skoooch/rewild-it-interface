import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = {
  active: false,
};

const switchSlice = createSlice({
  name: 'alarm',
  initialState: initialStateValue,
  reducers: {
    toggleOn: (state = initialStateValue) => {
      state.active = true;
    },
    toggleOff: (state = initialStateValue) => {
      state.active = false;
    },
  },
});

export const { toggleOn, toggleOff } = switchSlice.actions;
export default switchSlice.reducer;
