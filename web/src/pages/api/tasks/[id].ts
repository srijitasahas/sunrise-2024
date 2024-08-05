import { NextApiRequest, NextApiResponse } from 'next';
import {
    completeTask,
    updateTask,
    deleteTask,
    getAllTasks,
  } from "@/modules/taskManager";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const taskId = parseInt(id as string);

  if (req.method === 'GET') {
    const task = getAllTasks().find(task => task.id === taskId);
    res.status(200).json(task);
  } else if (req.method === 'PUT') {
    const { title, description, persona, group, completed } = req.body;
    if (completed) {
      completeTask(title);
    } else {
      updateTask(taskId, { title, description, persona, group });
    }
    res.status(200).json({ message: 'Task updated' });
  } else if (req.method === 'DELETE') {
    deleteTask(taskId);
    res.status(200).json({ message: 'Task deleted' });
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
