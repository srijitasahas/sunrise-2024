
import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";



let tasks: Task[] = [...initialTasks];

export function initializeTasks() {
    tasks = [...initialTasks];
}

export function getActiveTasks(): Task[] {
    return tasks.filter(task => !task.completed && isActive(task));
}

export function getCompletedTasks(): Task[] {
    return tasks.filter(task => task.completed);
}

export function getAllTasks(): Task[] {
    return tasks;
}

export function completeTask(taskTitle: string): void {
    const taskIndex = tasks.findIndex(task => task.title === taskTitle);
  if (taskIndex > -1) {
    tasks[taskIndex].completed = true;

    // Activate the next task in sequence
    const nextTaskIndex = tasks.findIndex(task => task.group === tasks[taskIndex].group + 1 && !task.completed);
    if (nextTaskIndex > -1) {
      tasks[nextTaskIndex].completed = false;
    }
  }
}

export function createTask(title: string, description: string, persona: string, group: number): void {
    const newTaskId = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = new Task(newTaskId, title, description, persona, group);
    tasks.push(newTask);
}

export function updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex > -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    }
}

export function deleteTask(taskId: number): void {
    tasks = tasks.filter(task => task.id !== taskId);
}

function isActive(task: Task): boolean {
    // A task is active if all previous tasks in its group are completed
    return tasks.filter(t => t.group < task.group).every(t => t.completed);
  }
