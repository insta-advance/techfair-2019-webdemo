import React from "react";
import { Pane, Select } from "evergreen-ui";

const Dropdown = ({ selected, onSelect, items }) => (
  <Pane margin="0.2rem">
    <Select
      onChange={e => {
        e.preventDefault();
        onSelect(e.target.value);
      }}
      value={selected}
    >
      {items.map(item => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </Select>
  </Pane>
);

export default Dropdown;
