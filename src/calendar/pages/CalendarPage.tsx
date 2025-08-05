import { use, useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { localizer, getMessagesES } from "../../helpers";
import {
  Navbar,
  CalendarEvent,
  CalendarModal,
  FabAddNew,
  FabDelete,
} from "../index";
import { useUiStore, useCalendarStore, useAuthStore } from "../../hooks";

export const CalendarPage = () => {
  const { user }: any = useAuthStore();
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
  const [lastView, setLastView] = useState(
    localStorage.getItem("lastView") || "month"
  );

  const eventStyleGetter = (
    event: any,
    start: any,
    end: any,
    isSelected: boolean
  ) => {
    const isMyEvent =
      user.uid === event.user._id || user.uid === event.user.uid;

    return {
      style: {
        backgroundColor: isMyEvent ? "#347CF7" : "#464660",
        borderRadius: "0px",
        opacity: 0.8,
        color: "white",
      },
    };
  };

  const onDoubleClick = () => {
    openDateModal();
  };
  const onSelect = (event: any) => {
    setActiveEvent(event);
  };
  const onViewChange = (event: any) => {
    localStorage.setItem("lastView", event);
    setLastView(event);
  };

  useEffect(() => {
    startLoadingEvents();
  }, []);

  return (
    <>
      <Navbar />
      <Calendar
        culture="es"
        localizer={localizer}
        events={events}
        defaultView={lastView as any}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "calc(100vh - 80px)" }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent,
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChange}
      />

      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>
  );
};
