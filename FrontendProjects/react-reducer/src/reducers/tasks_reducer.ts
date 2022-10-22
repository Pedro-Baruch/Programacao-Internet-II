import { useReducer } from "react";
import { Task } from "../models/models";

export interface TasksState {
    nextId: number
    tasks: Task[]
}

export const initialTasksState: TasksState = { 
    nextId: 3,
    tasks: [
        {id: 0, text: 'Elaborar Aulas', done: true},
        {id: 1, text: 'Estudar Flutter', done: false},
        {id: 2, text: 'Correr 4km', done: false},
    ]
}

export enum ActionType{'Added','Changed','Deleted'}

type Action = 
    {type: ActionType.Added, args: {text: string}}
    | {type: ActionType.Changed, args: {task: Task}}
    | {type: ActionType.Deleted, args: {id: number}}

  
const tasksReducer = (state: TasksState, action: Action): TasksState => {
    switch (action.type) {
        case ActionType.Added:
            const newTask = {id: state.nextId, text: action.args.text, done: false}
            return {nextId: state.nextId++, tasks: [...state.tasks, newTask]}
        case ActionType.Changed:
            const uTask = action.args.task
            const tasks = state.tasks.map(task => task.id === uTask.id ? uTask : task)
            return {...state, tasks}
        case ActionType.Deleted:
            const deletedTaskId = action.args.id
            const nextId = state.nextId--
            return {nextId, tasks: state.tasks.filter(task => task.id !== deletedTaskId)}
        default:
            console.debug('Unknow task action' + action)
            return state
    }
}

export const useTaskReducer = () => {
    return useReducer(tasksReducer, initialTasksState)
}
  