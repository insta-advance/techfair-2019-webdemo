import React from "react";
import { Pane, Heading, Icon } from "evergreen-ui";

const Header = ({ title, children }) => (
  <Pane
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="10rem"
  >
    <Icon marginRight="1rem" icon="clipboard" color="white" />
    <Heading color="white" marginRight="1rem" size={800}>
      {title}
    </Heading>
    {children}
  </Pane>
);

export default Header;
