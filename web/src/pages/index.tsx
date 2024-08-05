import React from 'react';
import TaskList from '@/components/taskList';

const Home: React.FC = () => {
  return (
    <div className='w-max-screen min-h-[100vh] bg-gray-100'>
      <div className='w-full text-lg font-bold bg-white py-4 px-8'>
      <h1 className='text-2xl font-semibold text-black'>Task Board</h1>
      </div>
      <TaskList />
    </div>
  );
};

export default Home;