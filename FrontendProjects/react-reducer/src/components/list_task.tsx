import { Task } from "../App"
import { TaskItem } from "./item_task"

interface TaskListProps{
    tasks: Task[]
    onChangeTask: any
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

