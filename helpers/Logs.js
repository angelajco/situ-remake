import React from "react";

const Log = ({ val }) => {
  return (
    <div>{JSON.stringify(val)}</div>
  )
}

const Logs = ({ title, items }) => (
  <div>
    <div>{title}</div>
    <div>
      {items.map((item, i) => (
        <Log key={i} val={item} />
      ))}
    </div>
  </div>
);

export default Logs;