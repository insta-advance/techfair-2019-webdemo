import { useReducer } from "react";
import { useAPI } from "./api/";
import { arrayToObject } from "./utils/helpers";

export const filters = {
  todos: {
    all: { id: "all", name: "Show all todos", fn: () => true },
    completed: {
      id: "completed",
      name: "Show completed todos",
      fn: item => item.isDone
    },
    notCompleted: {
      id: "notCompleted",
      name: "Show pending todos",
      fn: item => !item.isDone
    }
  }
};

const initialState = {
  activeUser: 2,
  todoFilter: filters.todos.notCompleted,
  loading: true,
  error: {
    isError: false,
    error: null
  },
  users: {},
  todos: {}
};

const ACTIONS = {
  ADD_TODO: "ADD_TODO",
  REMOVE_TODO: "REMOVE_TODO",
  TOGGLE_COMPLETED_TODO: "TOGGLE_COMPLETED_TODO",
  SET_TODO_FILTER: "SET_TODO_FILTER",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_ACTIVE_USER: "SET_ACTIVE_USER",
  SET_USER_TODOS: "SET_USER_TODOS",
  USERS_FETCHED: "USERS_FETCHED"
};

export const appActions = {
  setLoading(isLoading) {
    return { type: ACTIONS.SET_LOADING, payload: isLoading };
  },
  setError({ isError, error }) {
    return { type: ACTIONS.SET_ERROR, payload: { isError, error } };
  },
  setActiveUser(id) {
    return { type: ACTIONS.SET_ACTIVE_USER, payload: { id } };
  },
  usersFetched(users) {
    return { type: ACTIONS.USERS_FETCHED, payload: arrayToObject(users, "id") };
  },
  userFetched(user) {
    return { type: ACTIONS.USER_FETCHED, payload: user };
  }
};

export const todoActions = {
  add(todo) {
    return { type: ACTIONS.ADD_TODO, payload: todo };
  },
  remove(id) {
    return { type: ACTIONS.REMOVE_TODO, payload: { id } };
  },
  toggleCompleted(id) {
    return { type: ACTIONS.TOGGLE_COMPLETED_TODO, payload: { id } };
  },
  setFilter(filter) {
    return { type: ACTIONS.SET_TODO_FILTER, payload: filter };
  },
  fetchedUserTodos(id, todos) {
    return {
      type: ACTIONS.SET_USER_TODOS,
      payload: { id, todos: arrayToObject(todos, "id") }
    };
  },
  todoCreated(id, todo) {
    return {
      type: ACTIONS.ADD_TODO,
      payload: { id, todo }
    };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TODO: {
      const { id, todo } = action.payload;
      const user = state.users[id];
      const userTodos = user.todos || [];
      const newUser = { ...user, todos: userTodos.concat(todo.id) };
      const todos = { ...state.todos, [todo.id]: todo };
      const users = { ...state.users, [id]: newUser };
      return { ...state, users, todos };
    }
    case ACTIONS.REMOVE_TODO: {
      const id = action.payload.id;
      const todos = { ...state.todos };
      delete todos[id];
      return { ...state, todos };
    }
    case ACTIONS.TOGGLE_COMPLETED_TODO: {
      const id = action.payload.id;
      const todo = state.todos[id];
      const completed = !todo.completed;
      const newTodo = { ...todo, completed };
      return {
        ...state,
        todos: {
          ...state.todos,
          [id]: newTodo
        }
      };
    }
    case ACTIONS.SET_TODO_FILTER: {
      return { ...state, todoFilter: filters.todos[action.payload] };
    }
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_ACTIVE_USER:
      return {
        ...state,
        activeUser: action.payload.id,
        todoFilter: filters.todos.notCompleted
      };
    case ACTIONS.USERS_FETCHED:
      return { ...state, users: action.payload };
    case ACTIONS.USER_FETCHED: {
      const user = action.payload;
      const users = { ...state.users, [user.id]: user };
      return { ...state, users };
    }
    case ACTIONS.SET_USER_TODOS: {
      const { id, todos } = action.payload;
      const user = state.users[id];
      const newUser = { ...user, todos: Object.keys(todos) };
      const allUsers = { ...state.users, [id]: newUser };
      const allTodos = { ...state.todos, ...todos };
      return { ...state, todos: allTodos, users: allUsers };
    }
    default:
      return state;
  }
};

export const AppState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const API = useAPI(dispatch);

  return {
    state,
    dispatch,
    API
  };
};
