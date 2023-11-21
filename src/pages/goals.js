import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Modal from 'react-modal';
import axios from "axios";
import "../styles/navbar.css";
import "../styles/goals.css";
import "../globals.css"

function Goals() {
  const location = useLocation();
  const userId = location.state ? location.state.id : null;
  const [visible, setVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [exerciseList, setExerciseList] = useState([]);
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        const { firstName, lastName } = response.data;
        setUserName(`${firstName} ${lastName}`);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const addExercise = () => {
    const exercise = `${exerciseName}: ${sets} x ${reps} | ${weight} lb.`;
    setExerciseList([...exerciseList, exercise]);
    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
  };

  const removeExercise = (index) => {
    const updatedExercises = [...exerciseList];
    updatedExercises.splice(index, 1);
    setExerciseList(updatedExercises);
  };

  const addWorkout = () => {
    const workout = {
      title: workoutTitle,
      exercises: [...exerciseList],
    };

    setWorkouts([...workouts, workout]);
    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
    setWorkoutTitle("");
    setExerciseList([]);
    setVisible(false);
  };

  const closeAndClear = () => {
    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
    setWorkoutTitle("");
    setExerciseList([]);
    setVisible(false);
  };

  const removeWorkout = (index) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts.splice(index, 1);
    setWorkouts(updatedWorkouts);
  };

  return (
    <div className="Goals-Page">
      <div className="navbar">
        <Link to="/home" state={{ id: userId }}>HOME</Link>
        <Link to="/goals" state={{ id: userId }}>GOALS</Link>
        <Link to="/profile" state={{ id: userId }}>PROFILE</Link>
      </div>

      <div className="big-text">Hello {userName}. This is where you can add your workouts!</div>
      <button className="Goals-Page-button" onClick={() => setVisible(true)}>Add Workout</button>

      <Modal className="Modal" isOpen={visible} onRequestClose={closeAndClear}>
        <h1>Workout Title</h1>
        <div>
          <input type="text" value={workoutTitle} onChange={(e) => setWorkoutTitle(e.target.value)} />
        </div>

        <h1>Add Exercise</h1>
        <div>
          <label>Exercise Name:</label>
          <input type="text" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
        </div>
        <div>
          <label>Sets:</label>
          <input type="text" value={sets} onChange={(e) => setSets(e.target.value)} />
        </div>
        <div>
          <label>Reps:</label>
          <input type="text" value={reps} onChange={(e) => setReps(e.target.value)} />
        </div>
        <div>
          <label>Weight:</label>
          <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <button onClick={addExercise}>Add Exercise</button>

        <div>
          <h1>Exercise List</h1>
          <div className="exercise-list">
            {exerciseList.map((exercise, index) => (
              <div key={index}>
                <p>{exercise}</p>
                <button className="delete-button" onClick={() => removeExercise(index)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
        <button className="close-btn" onClick={closeAndClear}>Discard</button>
        <button onClick={addWorkout}>Submit Exercises</button>
      </Modal>

      <div>
        <div className="workouts-list">
          {workouts.map((workout, index) => (
            <div key={index} className="workout-item">
              <h3>{workout.title}</h3>
              <ul>
                {workout.exercises.map((exercise, exIndex) => (
                  <li key={exIndex}>{exercise}</li>
                ))}
              </ul>
              <button className="delete-button" onClick={() => removeWorkout(index)}>
                Delete Workout
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Goals;
