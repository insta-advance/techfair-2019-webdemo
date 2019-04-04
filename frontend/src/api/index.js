import { useState, useEffect } from "react";
import { appActions } from "../state";
import UsersAPI from "./users";
import TodosAPI from "./todos";

export const useAPI = dispatch => {
  const [state, setState] = useState({
    action: undefined,
    payload: undefined
  });

  const Users = UsersAPI(state, setState);
  const Todos = TodosAPI(state, setState);

  const { action, payload = {} } = state;

  useEffect(() => {
    const doFetch = async () => {
      if (!state.action) {
        return;
      }

      dispatch(appActions.setError({ isError: false, error: null }));
      dispatch(appActions.setLoading(true));

      try {
        dispatch(await state.action(payload));
      } catch (error) {
        console.log(error);
        dispatch(appActions.setError({ isError: true, error }));
      }

      dispatch(appActions.setLoading(false));
    };

    doFetch();
  }, [action, payload.id, payload.body]);

  return {
    Users,
    Todos
  };
};
