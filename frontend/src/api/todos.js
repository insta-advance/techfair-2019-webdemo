import { todoActions } from "../state";
import { USERS_URL } from "./constants";
import xhr from "../utils/xhr";

const getByUserId = ({ id }) =>
  xhr
    .get(`${USERS_URL}/${id}/todos`)
    .then(todos => todoActions.fetchedUserTodos(id, todos));

const create = ({ id, body }) =>
  xhr
    .post(`${USERS_URL}/${id}/todos`, body)
    .then(todo => todoActions.todoCreated(id, todo));

const toggleCompleted = ({ id, body }) =>
  xhr
    .put(`${USERS_URL}/${id}/todos/${body.id}`, body)
    .then(todo => todoActions.todoCreated(id, todo));

const TodosAPI = (state, setState) => {
  return {
    getByUserId(id) {
      setState({ ...state, action: getByUserId, payload: { id } });
    },
    create(userId, todo) {
      setState({
        ...state,
        action: create,
        payload: { id: userId, body: todo }
      });
    },
    toggleCompleted(userId, todo) {
      const toggledTodo = { ...todo, isDone: !todo.isDone };
      console.log(userId, toggledTodo);
      setState({
        ...state,
        action: toggleCompleted,
        payload: {
          id: userId,
          body: toggledTodo
        }
      });
    }
  };
};

export default TodosAPI;
