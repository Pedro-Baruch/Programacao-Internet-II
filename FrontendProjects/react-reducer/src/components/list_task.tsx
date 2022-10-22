
import { Task } from "../models/models"
import { TaskItem } from "./item_task"

interface TaskListProps{
    tasks: Task[]
    onChangeTask: (task: Task) => void
    onDeleteTask: (taskId: number) => void
}


export function TaskList({tasks, onChangeTask, onDeleteTask}: TaskListProps){

    return (
        <>
            <ul>
                {tasks.map(task => (
                   <TaskItem key={task.id} 
                        task={task} 
                        onChangeTask={onChangeTask} 
                        onDeleteTask={onDeleteTask} />
                ))}
            </ul>
        </>
    )
}

