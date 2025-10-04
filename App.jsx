import { useState, useEffect } from 'react';

// --- Componente para un solo item de la lista ---
function TodoItem({ task, onToggle, onDelete, onEditStart, onSaveEdit, isEditing, editText, setEditText }) {
  const taskClasses = `task-text ${task.completed ? 'completed' : ''}`;

  return (
    <li>
      {isEditing ? (
        <input
          type="text"
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={() => onSaveEdit(task.id)}
          onKeyDown={(e) => e.key === "Enter" && onSaveEdit(task.id)}
          autoFocus
        />
      ) : (
        <span
          className={taskClasses}
          onDoubleClick={() => onEditStart(task)}
        >
          {task.text}
        </span>
      )}

      <div>
        <button className="complete-btn" onClick={() => onToggle(task.id)}>
          {task.completed ? 'Desmarcar' : 'Completar'}
        </button>
        <button className="delete-btn" onClick={() => onDelete(task.id)}>
          Eliminar
        </button>
      </div>
    </li>
  );
}

// --- Componente Principal ---
function App() {
  // --- CARGAR tareas desde localStorage ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Aprender los fundamentos de React', completed: true },
      { id: 2, text: 'Construir una App de Tareas', completed: false },
      { id: 3, text: 'Explorar hooks avanzados', completed: false },
    ];
  });

  const [newTaskText, setNewTaskText] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState('');

  // --- NUEVO: Estado para el filtro ---
  const [filter, setFilter] = useState("all");

  // Guardar en localStorage cuando cambien las tareas
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Agregar nueva tarea
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;

    const newTask = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  // Completar/desmarcar tarea
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Eliminar tarea
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Editar tarea
  const onEditStart = (task) => {
    setEditTaskId(task.id);
    setEditText(task.text);
  };

  const onSaveEdit = (taskId) => {
    if (editText.trim() !== '') {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, text: editText } : task
      ));
    }
    setEditTaskId(null);
    setEditText('');
  };

  // --- Filtrar tareas según el estado seleccionado ---
  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true; 
  });

 
  return (
    <main>
      <h1>Lista de Tareas</h1>

      
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="¿Qué necesitas hacer?"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      
      <div className="filters">
        <button 
          className={filter === "all" ? "active" : ""} 
          onClick={() => setFilter("all")}
        >
          Todas
        </button>
        <button 
          className={filter === "pending" ? "active" : ""} 
          onClick={() => setFilter("pending")}
        >
          Pendientes
        </button>
        <button 
          className={filter === "completed" ? "active" : ""} 
          onClick={() => setFilter("completed")}
        >
          Completadas
        </button>
      </div>

      
      <section>
        <h2>Mis Tareas</h2>
        <ul>
          {filteredTasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              onToggle={toggleTaskCompletion}
              onDelete={deleteTask}
              onEditStart={onEditStart}
              onSaveEdit={onSaveEdit}
              isEditing={editTaskId === task.id}
              editText={editText}
              setEditText={setEditText}
            />
          ))}
        </ul>
      </section>
      <p>Creado por: Camila Rengifo</p>
    </main>
  );
}

export default App;


