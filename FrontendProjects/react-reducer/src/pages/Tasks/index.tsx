import { useCallback } from "react";
import { AddTask } from "../../components/add_task";
import { TaskList } from "../../components/list_task";
import { Task } from "../../models/models";
import { ActionType, useTaskReducer } from "../../reducers/tasks_reducer";
import { TasksDispatchContext,TasksContext } from "../../context/TasksContext";

export default function Tasks() {
  const [state, dispatch] = useTaskReducer();

  function handlerAddTask(text: string) {
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
      <TasksContext.Provider value={state}>
        <TasksDispatchContext.Provider value={dispatch}>
          <h1>React + Reducer</h1>
          <h3>Tarefas</h3>

          <AddTask onAddTask={handlerAddTask} />

          <TaskList
            tasks={state.tasks}
            onChangeTask={handleChangeTask}
            onDeleteTask={handleDeleteTask}
          />
        </TasksDispatchContext.Provider>
      </TasksContext.Provider>
    </div>
  );
}
