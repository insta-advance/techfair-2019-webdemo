import React, { useState } from "react";
import { Pane, Card, Label, Textarea, TextInput, Button } from "evergreen-ui";

const preventDefault = (...functions) => (event, ...args) => {
  event.preventDefault();
  functions.forEach(fn => fn(...args));
};

const initialFormState = { title: "", description: "" };

const TodoForm = ({ onSubmit }) => {
  const [formState, setFormState] = useState(initialFormState);

  const setTitle = e => setFormState({ ...formState, title: e.target.value });

  const setDescription = e =>
    setFormState({ ...formState, description: e.target.value });

  const resetForm = () => setFormState(initialFormState);

  const { title, description } = formState;
  return (
    <Card width="100%">
      <Pane width="100%">
        <Label
          color="white"
          htmlFor="new-todo__title"
          marginBottom={4}
          display="block"
        >
          Title
        </Label>
        <TextInput
          width="100%"
          fontSize="1rem"
          id="new-todo__title"
          value={title}
          onChange={setTitle}
          placeholder="Enter a title..."
        />
      </Pane>
      <Pane marginTop="2vh" width="100%">
        <Label
          color="white"
          htmlFor="new-todo__description"
          marginBottom={4}
          display="block"
        >
          Description
        </Label>
        <Textarea
          id="new-todo__description"
          width="100%"
          value={description}
          onChange={setDescription}
          placeholder="Enter a description..."
        />
      </Pane>
      <Pane marginTop="2vh" width="100%">
        <Button
          background="#D0DDD3"
          color="primary"
          width="100%"
          display="flex"
          justifyContent="center"
          onClick={event =>
            preventDefault(onSubmit, resetForm)(event, formState)
          }
        >
          Create todo
        </Button>
      </Pane>
    </Card>
  );
};

export default TodoForm;
