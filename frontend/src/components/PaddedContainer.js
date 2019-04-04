import React from "react";
import { Pane } from "evergreen-ui";

const PaddedContainer = ({ children }) => (
  <Pane
    paddingLeft="10vw"
    paddingRight="10vw"
    display="flex"
    flexDirection="column"
    alignItems="center"
  >
    {children}
  </Pane>
);

export default PaddedContainer;
