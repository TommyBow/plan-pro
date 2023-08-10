import React, { useState } from 'react';
import './TaskForm.css'; // Import the CSS file for the component

// A form component for adding tasks with title, description, and due date
const TaskForm = ({ onAddTask }) => {
  // State variables to manage form inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    onAddTask({ title, description, date }); // Invoke the provided callback with task details
    setTitle(''); // Clear the title input
    setDescription(''); // Clear the description input
    setDate(''); // Clear the date input
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {/* Input field for task title */}
      <input
        type="text"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Textarea for task description */}
      <textarea
        placeholder="Add description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      {/* Label and input field for due date */}
      <label htmlFor="task-date">Due Date:</label>
      <input
        type="date"
        id="task-date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {/* Button to submit the form */}
      <button type="submit">Add Note</button>
    </form>
  );
};

export default TaskForm;
