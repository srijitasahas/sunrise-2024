import React, { useEffect, useState } from 'react';
import Task from '@/model/Task';
import {
    Card,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Button } from './ui/button';
import { IoMdCheckmark } from "react-icons/io";

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentGroup, setCurrentGroup] = useState<number>(1);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        fetch('/api/tasks')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                return res.json();
            })
            .then((data) => {
                setTasks(data);
                updateCurrentGroup(data);
            })
            .catch((error) => setError(error.message));
    };

    const markAsCompleted = (taskId: number) => {
        fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to update task');
                }
                return res.json();
            })
            .then(() => {
                setTasks((prevTasks) => prevTasks.map((task) => task.id === taskId ? { ...task, completed: true } : task
                    )
                );
                updateCurrentGroup(tasks);
            })
            .catch((error) => setError(error.message));
    };

    const updateCurrentGroup = (tasks: Task[]) => {
        const completedGroups = new Set<number>();
        tasks.forEach(task => {
            if (task.completed) {
                completedGroups.add(task.group);
            }
        });

        let nextGroup = 1;
        while (completedGroups.has(nextGroup)) {
            nextGroup++;
        }

        setCurrentGroup(nextGroup);
    };

    const handleCreateTask = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newTask = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            persona: formData.get('persona') as string,
            group: parseInt(formData.get('group') as string),
        };

        fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to create task');
                }
                return res.json();
            })
            .then((createdTask) => {
                setTasks((prevTasks) => [...prevTasks, createdTask]);
                setIsModalVisible(false);
            })
            .catch((error) => setError(error.message));
    };

    const incompleteTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);
    const filteredTasks = tasks.filter(
        (task) => !task.completed && task.group === currentGroup
    );

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='w-full justify-evenly flex mt-4 pb-[2rem]'>
            <Button onClick={() => setIsModalVisible(true)} className="mb-4">
                Create New Task
            </Button>

            {/* Modal for creating a new task */}
            {isModalVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="relative w-full max-w-md mx-auto my-6">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                                <h3 className="text-2xl font-semibold">Create New Task</h3>
                                <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={() => setIsModalVisible(false)}
                                >
                                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                                        ×
                                    </span>
                                </button>
                            </div>
                            <form onSubmit={handleCreateTask} className="px-6 py-4">
                                <div className="mb-4">
                                    <input
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                        type="text"
                                        name="title"
                                        placeholder="Task Title"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <textarea
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                        name="description"
                                        placeholder="Task Description"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <input
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                        type="text"
                                        name="persona"
                                        placeholder="Persona"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <select
                                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                                        name="group"
                                        required
                                    >
                                        <option value="">Select Group</option>
                                        <option value="1">Group 1</option>
                                        <option value="2">Group 2</option>
                                        <option value="3">Group 3</option>
                                        <option value="4">Group 4</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                                    <button
                                        className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-blue-500 rounded shadow outline-none active:bg-blue-600 hover:shadow-lg focus:outline-none"
                                        type="submit"
                                    >
                                        Create Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Pending tasks */}
            <div className='w-[30%] px-4'>
                <h1 className='font-bold flex items-center gap-2 mb-4'>
                    To-Do <span className='w-[20px] h-[20px] text-center bg-gray-300 rounded-full text-[12px] p-[1px] text-gray-600'>{incompleteTasks.length}</span>
                </h1>
                {incompleteTasks.length > 0 && (
                    <div className='flex flex-col gap-4'>
                        <ul className='flex flex-col flex-wrap gap-4'>
                            {incompleteTasks.map((task) => (
                                <li key={task.id}>
                                    <Card className='w-full bg-white'>
                                        <div className='flex justify-between items-center border py-2 px-4'>
                                            <div className='text-lg font-bold'>Task {task.id}</div>
                                            <Button
                                                disabled={!task.completed}
                                                className='disabled:bg-gray-300 border flex gap-2 items-center'
                                            >
                                                <IoMdCheckmark /> Done
                                            </Button>
                                        </div>
                                        <div className='flex flex-col gap-2 p-4'>
                                            <CardTitle className='text-lg font-semibold'>{task.title}</CardTitle>
                                            <CardDescription className='text-sm font-normal text-gray-500'>{task.description}</CardDescription>
                                        </div>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* In process task */}
            <div className='w-[30%] px-4'>
                <h1 className='font-bold flex items-center gap-2 mb-4'>
                    In Progress <span className='w-[20px] h-[20px] text-center rounded-full text-[12px] p-[1px] bg-sky-200 text-sky-500'>{filteredTasks.length}</span>
                </h1>
                {filteredTasks.length > 0 && (
                    <div className='flex flex-col gap-4'>
                        <ul className='flex flex-col flex-wrap gap-4'>
                            {filteredTasks.map((task) => (
                                <li key={task.id}>
                                    <Card className='w-full bg-white'>
                                        <div className='flex justify-between items-center border py-2 px-4'>
                                            <div className='text-lg font-bold'>Task {task.id}</div>
                                            <Button
                                                onClick={() => markAsCompleted(task.id)}
                                                className='border flex gap-2 items-center  bg-blue-500 text-white'
                                            >
                                                <IoMdCheckmark /> Done
                                            </Button>
                                        </div>
                                        <div className='flex flex-col gap-2 p-4'>
                                            <CardTitle className='text-lg font-semibold'>{task.title}</CardTitle>
                                            <CardDescription className='text-sm font-normal text-gray-500'>{task.description}</CardDescription>
                                        </div>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Completed tasks */}
            <div className='w-[30%] px-4'>
                <h1 className='font-bold flex items-center gap-2 mb-4'>
                    Completed Tasks <span className='w-[20px] h-[20px] text-center rounded-full text-[12px] p-[1px] bg-green-500 text-white'>{completedTasks.length}</span>
                </h1>
                {completedTasks.length > 0 && (
                    <div className='flex flex-col gap-4'>
                        <ul className='flex flex-col flex-wrap gap-4'>
                            {completedTasks.map((task) => (
                                <li key={task.id}>
                                    <Card className='w-full bg-white'>
                                        <div className='flex justify-center items-center border py-2 px-4'>
                                            <h2 className='text-lg text-center font-bold'>Task {task.id}</h2>
                                        </div>
                                        <div className='flex flex-col gap-2 p-4'>
                                            <CardTitle className='text-lg font-semibold'>{task.title}</CardTitle>
                                            <CardDescription className='text-sm font-normal text-gray-500'>{task.description}</CardDescription>
                                        </div>
                                    </Card>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskList;
