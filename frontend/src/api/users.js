import { appActions } from "../state";
import { USERS_URL } from "./constants";
import xhr from "../utils/xhr";

const getAll = () => xhr.get(USERS_URL).then(appActions.usersFetched);
const getById = ({ id }) =>
  xhr.get(`${USERS_URL}/${id}`).then(appActions.userFetched);

const UsersAPI = (state, setState) => {
  return {
    getAll() {
      setState({ ...state, action: getAll });
    },
    getById(id) {
      setState({ ...state, action: getById, payload: { id } });
    }
  };
};

export default UsersAPI;
