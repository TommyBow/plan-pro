import React from 'react';
import './TaskList.css';

// Component to display a list of tasks
const TaskList = ({ tasks, onEditTask, onDeleteTask }) => {
  return (
    <div>
      {/* Map through each task and render its details */}
      {tasks.map((task) => (
        <div className="task" key={task._id}>
          {/* Display task title */}
          <h3>{task.title}</h3>
          
          {/* Display task description */}
          <p>{task.description}</p>
          
          {/* Display formatted date */}
          <p className="date">Date: {new Date(task.date).toLocaleString()}</p>
          
          {/* Button to edit the task */}
          <button onClick={() => onEditTask(task)}>Edit</button>
          
          {/* Button to delete the task */}
          <button onClick={() => onDeleteTask(task._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
