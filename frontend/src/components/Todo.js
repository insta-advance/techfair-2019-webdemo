import React from "react";
import { Card, Pane, Icon, Heading, Text, Button } from "evergreen-ui";

const getCompletionText = isCompleted =>
  isCompleted ? "Oops, not done" : "'Tis done!";

const Todo = ({ title, description, isDone, onClick }) => (
  <Card
    width="100%"
    minHeight="15vh"
    marginBottom={16}
    padding="2vh"
    background="white"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
  >
    <Heading size={600}>
      {isDone && (
        <Icon marginRight="0.3rem" icon="tick-circle" color="success" />
      )}
      {title}
    </Heading>
    <Pane marginTop="1rem">
      <Text>{description}</Text>
    </Pane>
    <Pane marginTop="1rem">
      <Button color="primary" onClick={onClick}>
        {getCompletionText(isDone)}
      </Button>
    </Pane>
  </Card>
);

export default Todo;
