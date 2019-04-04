import React from "react";
import { Pane } from "evergreen-ui";

const PaddedGrid = ({ children }) => (
  <Pane
    marginLeft="10vw"
    padding="2vw"
    marginRight="10vw"
    marginBottom="4vh"
    display="grid"
    background="tint2"
    gridTemplateColumns="1fr 1fr"
    justifyItems="center"
    alignItems="flex-start"
    gridGap="1rem"
    borderRadius="0.5rem"
  >
    {children}
  </Pane>
);

export default PaddedGrid;
