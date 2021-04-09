import { useState, useCallback, useRef } from "react";

import createUndoRedo from "../../helpers/index";
import Logs from "../../helpers/Logs";

function useTimeline() {
  const timelineRef = useRef(new createUndoRedo());
  const [state, setState] = useState(timelineRef.current.current);

  const update = (value) => {
    const nextState = timelineRef.current.update(value);
    setState(nextState);
  };

  const undo = () => {
    const nextState = timelineRef.current.undo();
    setState(nextState);
  };

  const redo = () => {
    const nextState = timelineRef.current.redo();
    setState(nextState);
  };

  return [state, { ...timelineRef.current, update, undo, redo }];
}

export default function Prueba() {
  const [value, setValue] = useState("");
  const [todos, { timeline, canUndo, canRedo, update, undo, redo }] = useTimeline();
  const onValueChange = ({ target }) => setValue(target.value);

  const add = () => {
    const newTodo = value;
    const nextTodos = [...todos, newTodo];
    update(nextTodos);
    setValue("");
  };

  const undoRedo = useCallback(
    ({ target }) => {
      target.name === "undo" ? undo() : redo();
    },
    [undo, redo]
  );

  return (
    <div className="App">
      <div className="left">
        <div className="controls">
          <input value={value} onChange={onValueChange} />
          <div className="actions">
            <button onClick={add} disabled={!value}>
              Add
            </button>

            <button disabled={!canUndo} name="undo" onClick={undoRedo}>
              undo
            </button>
            <button disabled={!canRedo} name="redo" onClick={undoRedo}>
              redo
            </button>
          </div>
        </div>
        {todos.map((todo, index) => (
          <div key={index}>
            {todo}
          </div>
        )
        )}
      </div>
      <br />
      <br />
      <div className="right">
        <div className="right-title">LOG</div>
        <div>
          <div className="logs row">
            <div className="col-3">

              <Logs title="history" items={timeline.history} />
            </div>
            <div className="col-3">

              <Logs title="current" items={timeline.current} />
            </div>
            <div className="col-3">

              <Logs title="future" items={timeline.future} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}