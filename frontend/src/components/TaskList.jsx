import { useContext, useState } from "react";
import { loginContextObj } from "../LoginContext";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

function TaskList() {
  const { currentUser, setCurrentUser } = useContext(loginContextObj);
  const { register, handleSubmit, setValue } = useForm();

  const [modalState, setModalState] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);

  const openModal = (taskObj) => {
    setModalState(true);
    setValue("taskName", taskObj.taskName);
    setValue("description", taskObj.description);
    setTaskBeingEdited(taskObj);
  };

  const closeModal = () => setModalState(false);

  // Edit Task
  const saveModifiedTask = async (modifiedTaskObj) => {
    if (!currentUser?._id || !taskBeingEdited?._id) return;

    try {
      const res = await axios.put(
        `http://localhost:8000/user-api/edit-todo/${currentUser._id}/${taskBeingEdited._id}`,
        modifiedTaskObj,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setCurrentUser(res.data.payload);
        closeModal();
      }
    } catch (err) {
      console.error("Error editing task:", err.response?.data?.message || err.message);
    }
  };

  // Mark Task as Completed
  const setTaskCompleted = async (taskid) => {
    if (!currentUser?._id) return;

    try {
      const res = await axios.put(
        `http://localhost:8000/user-api/edit-status/${currentUser._id}/${taskid}`,
        null,
        { withCredentials: true }
      );

      if (res.status === 200) setCurrentUser(res.data.payload);
    } catch (err) {
      console.error("Error completing task:", err.response?.data?.message || err.message);
    }
  };

  // Delete Task
  const deleteTask = async (taskid) => {
    if (!currentUser?._id) return;

    try {
      const res = await axios.put(
        `http://localhost:8000/user-api/delete-todo/${currentUser._id}/${taskid}`,
        null,
        { withCredentials: true }
      );

      if (res.status === 200) setCurrentUser(res.data.payload);
    } catch (err) {
      console.error("Error deleting task:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="mt-4">
      <h1>List of Tasks</h1>

      {currentUser?.todos?.length > 0 ? (
        currentUser.todos.map((todoObj) => (
          <div className="mb-3 border border-2 p-3" key={todoObj._id}>
            <div className="text-start mb-2">
              <button className="btn btn-primary me-2" onClick={() => openModal(todoObj)}>Edit</button>
              <button className="btn btn-close" onClick={() => deleteTask(todoObj._id)}></button>
            </div>

            <div className="text-end mb-2">
              <span className="bg-warning rounded p-1">{todoObj.status}</span>
            </div>

            <h2>{todoObj.taskName}</h2>
            <small>{todoObj.description}</small>

            {todoObj.status === "pending" && (
              <div className="text-end mt-2">
                <button className="btn btn-success" onClick={() => setTaskCompleted(todoObj._id)}>
                  Mark as completed
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No tasks found</p>
      )}

      {/* Edit Modal */}
      <Modal show={modalState} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(saveModifiedTask)}>
            <input
              type="text"
              {...register("taskName", { required: true })}
              className="form-control mb-3"
            />
            <input
              type="text"
              {...register("description", { required: true })}
              className="form-control mb-3"
            />
            <button type="submit" className="btn btn-success">Save</button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TaskList;
