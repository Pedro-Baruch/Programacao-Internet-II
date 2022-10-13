import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Task } from "../App"

interface TaskItemProps{
    task: Task
    onChangeTask: any
    onDeleteTask: (taskId: number) => void
}

export function TaskItem({task, onChangeTask, onDeleteTask}: TaskItemProps){
    const [taskText, setTaskText] = useState(task.text)
    const [isEditing, setIsEditing] = useState(false)

    // useCallback --> Faz memória da função entre as redenrizações
    const handlerDoneChange = useCallback(()=>{
        () => {
            task.done = !task.done
            onChangeTask(task)
        }
    },[task])


    // Implantar --> useCallback
    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTaskText(event.target.value)
    }

    // Implantar --> useCallback
    const handleEditSaveClick = () => {
        if (isEditing){
            onChangeTask({...task, text: taskText})
            setIsEditing(false)
        }else{
            setIsEditing(true)
        }
    }

    // useMemo --> Faz Memória valores entre renderizações/sincronizações
    const buttonLabel = useMemo(() => isEditing ? "Salvar" : "Editar", [isEditing])

    // useHef --> Similar a useState, porém não muda. (atributo current)
    /* Usado geralmente para ficar conectado a algum HTMLElement
      e assim ler ou alterar algum atributo/estado  */
    const inputTaskTextRef = useRef<HTMLInputElement>(null)

    useEffect(()=> {
        isEditing && inputTaskTextRef.current!.focus()
    }, [isEditing])

    return (
        <li key={task.id}>
            <input type="checkbox" checked={task.done} onChange={handlerDoneChange}/>
            
            {
                isEditing ? 
                        (
                            <input 
                                ref={inputTaskTextRef}
                                value={taskText} 
                                onChange={handleTextChange} 
                                />
                        ) 
                    : 
                        (<span>{task.text}</span>)
            }

            <button onClick={handleEditSaveClick}>{buttonLabel}</button>
            <button onClick={() => onDeleteTask(task.id)} >Apagar</button>
        </li>
    )
}