import { NextApiRequest, NextApiResponse } from "next";
import {
    getAllTasks, createTask
} from "@/modules/taskManager";

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    res.status(200).json(getAllTasks());
  } else if (req.method === 'POST') {
    const { title, description, persona, group } = req.body;
    createTask(title, description, persona, group);
    res.status(201).json({ message: 'Task created' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
