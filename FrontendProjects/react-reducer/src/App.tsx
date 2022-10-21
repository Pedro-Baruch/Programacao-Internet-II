import React, { useReducer, useState } from "react";
import "./App.css";
import { AddTask } from "./components/add_task";
import { TaskList } from "./components/list_task";
import { useCallback } from "react";
import {
  ActionType,
  appStateReducer,
  initialState,
} from "./reducers/app_reducer";

export default function App() {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  function handleAddTask(text: string) {
    dispatch({
      type: ActionType.Added,
      args: { text },
    });
  }

  function handleChangeTask(task: Task) {
    dispatch({
      type: ActionType.Changed,
      args: { task },
    });
  }

  const handleDeleteTask = useCallback((id: number) => {
    dispatch({
      type: ActionType.Deleted,
      args: { id },
    });
  }, []);

  return (
    <div className="App">
      <h1>React + Reducer</h1>
      <h3>Tasks</h3>

      <AddTask onAddTask={handleAddTask} />

      <TaskList
        tasks={state.tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}

export interface Task {
  id: number;
  text: string;
  done: boolean;
}
