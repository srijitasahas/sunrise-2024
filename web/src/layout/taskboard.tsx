
import React from 'react';
import styles from './TaskBoard.module.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'To-Do' | 'In Progress' | 'Completed';
}

const tasks: Task[] = [
  { id: 1, title: 'Initial Setup', description: 'Set up the development environment', status: 'In Progress' },
  { id: 2, title: 'Basic Introduction', description: 'Complete the introductory module', status: 'In Progress' },
  { id: 3, title: 'Basic Git', description: 'Learn basic GIT commands', status: 'To-Do' },
  { id: 4, title: 'Git Collaboration', description: 'Collaborate on a Git repository', status: 'To-Do' },
  { id: 5, title: 'JavaScript Basics', description: 'Complete JavaScript basics tutorial', status: 'To-Do' },
  { id: 6, title: 'JavaScript Project', description: 'Create a small JavaScript project', status: 'To-Do' },
  { id: 7, title: 'API Introduction', description: 'Learn about RESTful APIs', status: 'To-Do' },
  { id: 8, title: 'API Consumption', description: 'Consume an API in a project', status: 'To-Do' },
  { id: 9, title: 'Final Project', description: 'Complete the final project', status: 'To-Do' },
  { id: 10, title: 'Project Presentation', description: 'Present the final project', status: 'To-Do' },
];

const TaskCard: React.FC<Task> = ({ title, description, status }) => (
  <div className={styles.taskCard}>
    <h3>{title}</h3>
    <p>{description}</p>
    <button className={status === 'In Progress' ? styles.doneButtonBlue : styles.doneButton}>
      {status === 'In Progress' ? '✓ Done' : 'Done'}
    </button>
  </div>
);

const TaskColumn: React.FC<{ title: string; tasks: Task[] }> = ({ title, tasks }) => (
  <div className={styles.taskColumn}>
    <h2>{title} <span className={styles.taskCount}>{tasks.length}</span></h2>
    {tasks.map(task => <TaskCard key={task.id} {...task} />)}
  </div>
);

const TaskBoard: React.FC = () => {
  const todoTasks = tasks.filter(task => task.status === 'To-Do');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  return (
    <div className={styles.taskBoard}>
      <h1>Task Board</h1>
      <div className={styles.columnsContainer}>
        <TaskColumn title="To-Do" tasks={todoTasks} />
        <TaskColumn title="In Progress" tasks={inProgressTasks} />
        <TaskColumn title="Completed" tasks={completedTasks} />
      </div>
    </div>
  );
};

export default TaskBoard;