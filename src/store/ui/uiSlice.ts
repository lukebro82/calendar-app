import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isDateModalOpen: false,
  },
  reducers: {
    onCloseDateModal: (state) => {
      state.isDateModalOpen = false;
    },
    onOpenDateModal: (state) => {
      state.isDateModalOpen = true;
    },
  },
});

export const { onCloseDateModal, onOpenDateModal } = uiSlice.actions;
