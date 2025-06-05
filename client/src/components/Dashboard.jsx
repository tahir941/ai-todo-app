import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { fetchTasks } from '../redux/slices/taskSlice';
import ProgressChart from './ProgressChart';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, loading } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1 className="display-5 fw-bold">Dashboard</h1>
        <p className="lead text-muted">You are now logged in. Here’s a quick overview of your tasks.</p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Total Tasks</h5>
              <p className="fs-4">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Pending Tasks</h5>
              <p className="fs-4 text-warning">{pendingTasks}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Completed Tasks</h5>
              <p className="fs-4 text-success">{completedTasks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-5 text-center">
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <ProgressChart completed={completedTasks} total={totalTasks} />
        )}
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
        <Link to="/tasks" className="btn btn-primary px-4">
          View My Tasks
        </Link>
        <button className="btn btn-danger px-4" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
