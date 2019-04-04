import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { AppState, appActions, todoActions, filters } from "./state";

import Header from "./components/Header";
import TodoForm from "./components/TodoForm";
import PaddedGrid from "./components/PaddedGrid";
import PaddedContainer from "./components/PaddedContainer";
import Todo from "./components/Todo";
import Dropdown from "./components/Dropdown";
import { Heading, Spinner, Card } from "evergreen-ui";

const { setActiveUser } = appActions;

let startup = true;

function TechFairTodoApp() {
  const { state, dispatch, API } = AppState();

  useEffect(() => {
    API.Users.getAll();
  }, [startup]);

  const { loading, activeUser, users, todos } = state;

  const me = users[activeUser];

  useEffect(() => {
    if (!me) {
      return;
    }
    API.Todos.getByUserId(activeUser);
  }, [me]);

  console.log(state);
  const myTodos =
    me && me.todos
      ? me.todos.map(todoId => todos[todoId]).filter(state.todoFilter.fn)
      : [];

  const usersList = Object.values(state.users);

  return (
    <div className="App">
      <Header title="TechFair TodoList">
        <Dropdown
          selected={activeUser}
          items={usersList}
          onSelect={id => dispatch(setActiveUser(id))}
        />
        <Dropdown
          selected={state.todoFilter.id}
          items={Object.values(filters.todos)}
          onSelect={filter => dispatch(todoActions.setFilter(filter))}
        />
      </Header>
      {(() => {
        if (myTodos.length === 0 && loading) {
          return (
            <PaddedGrid>
              {Array(4)
                .fill()
                .map((_, index) => (
                  <Card
                    key={index}
                    width="100%"
                    height="15vh"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    background="tint1"
                  >
                    <Spinner />
                  </Card>
                ))}
            </PaddedGrid>
          );
        } else if (myTodos.length === 0) {
          return (
            <Heading color="white" marginBottom="2rem" size={600}>
              No todos to show
            </Heading>
          );
        }
        return (
          <PaddedGrid>
            {myTodos.map(todo => (
              <Todo
                key={todo.id}
                onClick={() => API.Todos.toggleCompleted(activeUser, todo)}
                {...todo}
              />
            ))}
          </PaddedGrid>
        );
      })()}
      <PaddedContainer>
        <TodoForm onSubmit={data => API.Todos.create(activeUser, data)} />
      </PaddedContainer>
    </div>
  );
}

ReactDOM.render(<TechFairTodoApp />, document.getElementById("root"));
