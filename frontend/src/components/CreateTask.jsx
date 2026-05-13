import { useForm } from "react-hook-form";
import { useContext } from "react";
import { loginContextObj } from "../LoginContext";
import axios from "axios";

function CreateTask() {
  const { currentUser, setCurrentUser } = useContext(loginContextObj);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmitNewtask = async (newTask) => {
    if (!currentUser?._id) {
      alert("User not logged in yet!");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/user-api/todo/${currentUser._id}`,
        newTask,
        { withCredentials: true }
      );

      if (res.data.message === "todo added") {
        setCurrentUser(res.data.payload); // update UI
        reset(); // clear form
      }
    } catch (err) {
      console.error("Error adding task:", err.response?.data?.message || err.message);
    }
  };


  return (
    <div>
      <h1>Create Task</h1>
      <form className="w-75 mx-auto mt-3" onSubmit={handleSubmit(onSubmitNewtask)}>
        <div className="mb-3">
          <input
            type="text"
            {...register("taskName", { required: true })}
            className="form-control"
            placeholder="Task Name"
          />
          {errors?.taskName && <p className="text-danger">Task name is required</p>}
        </div>
        <div className="mb-3">
          <input
            type="text"
            {...register("description", { required: true })}
            className="form-control"
            placeholder="Task Description"
          />
          {errors?.description && <p className="text-danger">Task Description is required</p>}
        </div>
        <button type="submit" className="btn btn-info">Create</button>
      </form>
    </div>
  );
}

export default CreateTask;
