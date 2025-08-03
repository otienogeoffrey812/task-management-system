import { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Chip,
  Box,
  Grid,
} from '@mui/material';
import taskService from '../services/taskService';
import userService from '../services/userService';
import TaskModal from '../components/modals/TaskModal';
import { TaskStatus } from '../constants/enums';
import { Task } from '../types/Task';
import { User } from '../types/User';
import { useAuth } from '../context/AuthContext';

const statuses = Object.values(TaskStatus);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus | null>(null);
  const [filterUserId, setFilterUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [taskRes, userRes] = await Promise.all([
          taskService.getAll(),
          userService.getAll(),
        ]);
        console.log("taskRes: ", taskRes)
        setTasks(taskRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTaskClick = (task: Task) => {
      setSelectedTask(task);
      setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedTask(null);
    setNewTaskStatus(TaskStatus.TODO);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setNewTaskStatus(null);
  };

  const handleTaskSave = async (task: Task) => {
    try {
      let savedTask: Task;

      if (task.id) {
        const res = await taskService.update(task.id, task);
        savedTask = res.data;
      } else {
        const res = await taskService.create(task);
        savedTask = res.data;
      }

      const updatedTasks = task.id
        ? tasks.map((t) => (t.id === savedTask.id ? savedTask : t))
        : [...tasks, savedTask];

      setTasks(updatedTasks);
      handleModalClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      await taskService.delete(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      handleModalClose();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = useMemo(() => {
    return filterUserId
      ? tasks.filter((t) => t.assigneeId === filterUserId)
      : tasks;
  }, [tasks, filterUserId]);

  const groupedTasks = useMemo(() => {
    return {
      [TaskStatus.TODO]: filteredTasks.filter((t) => t.status === TaskStatus.TODO),
      [TaskStatus.IN_PROGRESS]: filteredTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS),
      [TaskStatus.DONE]: filteredTasks.filter((t) => t.status === TaskStatus.DONE),
    };
  }, [filteredTasks]);

  return (
    <Container>
      <Grid container spacing={2} mt={4} mb={2} alignItems="center">
        <Grid size={{xs: 12, md: 6}}>
          <Typography variant="h4">Task Dashboard</Typography>
        </Grid>
        <Grid size={{xs: 12, md: 6}} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          {isAdmin && (
            <Button variant="contained" color="success" onClick={handleAddClick}>
              + Add Task
            </Button>
          )}
        </Grid>
      </Grid>

      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Filter by Assignee:
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip
            label="All"
            color={!filterUserId ? 'primary' : 'default'}
            onClick={() => setFilterUserId(null)}
          />
          {users.map((user) => (
            <Chip
              key={user.id}
              label={user.fullName || ''}
              color={filterUserId === user.id ? 'primary' : 'default'}
              onClick={() => setFilterUserId(user.id)}
            />
          ))}
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {statuses.map((status) => (
            <Grid key={status} size={{xs: 12, sm: 6, md: 4}} >
              <Paper elevation={3} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom>
                  {status.replace('_', ' ')}
                </Typography>
                {groupedTasks[status].map((task) => {
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                  const priorityColor = {
                    HIGH: 'error.main',
                    MEDIUM: 'warning.main',
                    LOW: 'success.main',
                  }[task.priority ?? 'MEDIUM'];

                  return (
                    <Box
                      key={task.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor: isOverdue ? '#ffe6e6' : '#fff',
                        border: isOverdue ? '1px solid red' : '1px solid transparent',
                        boxShadow: 1,
                        mb: 1,
                        cursor: isAdmin || task.assigneeId === user?.id ? 'pointer' : 'default',
                      }}
                      onClick={() => handleTaskClick(task)}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight="bold">{task.title}</Typography>
                        <Chip
                          size="small"
                          label={task.priority}
                          sx={{ backgroundColor: priorityColor, color: '#fff' }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      {task.dueDate && (
                        <Typography
                          variant="caption"
                          color={isOverdue ? 'error' : 'text.secondary'}
                        >
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <TaskModal
        open={isModalOpen}
        task={selectedTask}
        defaultStatus={newTaskStatus}
        onClose={handleModalClose}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
        user={user}
      />
    </Container>
  );
};

export default Dashboard;