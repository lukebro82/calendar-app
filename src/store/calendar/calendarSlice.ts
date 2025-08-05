import { createSlice } from "@reduxjs/toolkit";

export interface CalendarEvent {
  id: string;
  title: string;
  notes: string;
  start: string;
  end: string;
  user: {
    _id: string;
    name: string;
  };
}

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    isLoadingEvents: true,
    events: [] as CalendarEvent[],
    activeEvent: null,
  },
  reducers: {
    onSetActiveEvent: (state, { payload }) => {
      state.activeEvent = payload;
    },
    onAddNewEvent: (state, { payload }) => {
      state.events.push(payload);
      state.activeEvent = null;
    },
    onUpdateEvent: (state, { payload }) => {
      state.events = state.events.map((event: any) =>
        event.id === payload.id ? payload : event
      );
      state.activeEvent = null;
    },
    onDeleteEvent: (state: any) => {
      if (state.activeEvent) {
        state.events = state.events.filter(
          (event: any) => event.id !== state.activeEvent?.id
        );
        state.activeEvent = null;
      }
    },

    onLoadEvents: (state, { payload = [] }) => {
      state.isLoadingEvents = false;

      payload.forEach((event: any) => {
        const exists = state.events.some(
          (dbEvent: any) => dbEvent.id === event.id
        );
        if (!exists) {
          state.events.push(event);
        }
      });
    },

    onLogoutCalendar: (state) => {
      state.isLoadingEvents = true;
      state.events = [];
      state.activeEvent = null;
    },
  },
});

export const {
  onSetActiveEvent,
  onAddNewEvent,
  onUpdateEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
} = calendarSlice.actions;
