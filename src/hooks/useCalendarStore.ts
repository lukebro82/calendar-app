import { useDispatch, useSelector } from "react-redux";
import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onSetActiveEvent,
  onUpdateEvent,
  type RootState,
} from "../store";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {
  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector(
    (state: RootState) => state.calendar
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const setActiveEvent = (calendarEvent: any) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent: any) => {
    try {
      if (calendarEvent.id) {
        await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
        dispatch(onUpdateEvent({ ...calendarEvent, user }));
        return;
      }
      const { data } = await calendarApi.post("/events", calendarEvent);
      dispatch(onAddNewEvent({ ...calendarEvent, id: data.id, user: user }));
    } catch (error: any) {
      Swal.fire("Error al guardar", error.response.data.message, "error");
    }
  };

  const startDeleteEvent = async () => {
    if (!activeEvent) return;
    try {
      const id = (activeEvent as any).id;
      await calendarApi.delete(`/events/${id}`);

      dispatch(onDeleteEvent());
    } catch (error: any) {
      Swal.fire("Error al borrar", error.response.data.message, "error");
    }
  };

  const startLoadingEvents = async () => {
    try {
      const { data }: any = await calendarApi.get("/events");

      const events = convertEventsToDateEvents(data.events);

      dispatch(onLoadEvents(events));
    } catch (error) {
      console.log("Erro carregando eventos");
      console.log(error);
    }
  };

  return {
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,
    setActiveEvent,
    startSavingEvent,
    startDeleteEvent,
    startLoadingEvents,
  };
};
