import { calendarApi } from "../api";
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
  type RootState,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { onLogoutCalendar } from "../store/calendar/calendarSlice";

interface ApiError {
  response: {
    data: {
      message: string;
      errors?: Array<{ msg: string }>;
    };
  };
}

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  const startLogin = async ({ email, password }: any) => {
    dispatch(onChecking());
    try {
      const resp = await calendarApi.post("/auth", { email, password });
      localStorage.setItem("token", resp.data.token);
      localStorage.setItem("token-init-date", new Date().getTime().toString());
      dispatch(onLogin({ name: resp.data.name, uid: resp.data.uid }));
    } catch (error) {
      dispatch(onLogout("Credenciales incorrectas"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const startRegisterUser = async ({ name, email, password }: any) => {
    try {
      const resp = await calendarApi.post("/auth/new", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", resp.data.token);
      localStorage.setItem("token-init-date", new Date().getTime().toString());
      dispatch(onLogin({ name: resp.data.name, uid: resp.data.uid }));
    } catch (error) {
      console.log(error);

      const err = error as ApiError;

      if (err.response?.data?.errors) {
        dispatch(onLogout(err.response.data.errors[0].msg));
        return;
      }

      dispatch(onLogout(err.response.data.message));
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout(null));

    try {
      const { data } = await calendarApi.get("/auth/renew");
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime().toString());
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout(null));
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout(null));
  };

  return {
    status,
    errorMessage,
    user,
    startLogin,
    startRegisterUser,
    checkAuthToken,
    startLogout,
  };
};
