import React from "react";

const Log = ({ val }) => {
  return (
    <div>
      <pre>
        {val.length}
        {JSON.stringify(val, null, 3)}
      </pre>
    </div>
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