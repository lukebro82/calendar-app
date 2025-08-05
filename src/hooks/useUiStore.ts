import { useDispatch, useSelector } from "react-redux";
import { onCloseDateModal, onOpenDateModal, type RootState } from "../store";

export const useUiStore = () => {
  const dispatch = useDispatch();

  const { isDateModalOpen } = useSelector((state: RootState) => state.ui);

  const openDateModal = () => {
    dispatch(onOpenDateModal());
  };

  const closeDateModal = () => {
    dispatch(onCloseDateModal());
  };

  return { isDateModalOpen, openDateModal, closeDateModal };
};
