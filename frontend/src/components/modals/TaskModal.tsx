import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  CircularProgress,
  Box,
  IconButton,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TaskStatus, Priority } from '../../constants/enums';
import { Task } from '../../types/Task';
import { User } from '../../types/User';
import userService from '../../services/userService';

interface Props {
  open: boolean;
  task: Task | null;
  defaultStatus: TaskStatus | null;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: number) => void;
  user: User | null;
  error?: string | null;
}

type TaskForm = Omit<Task, 'id'>;

const TaskModal: React.FC<Props> = ({
  open,
  task,
  defaultStatus,
  onClose,
  onSave,
  onDelete,
  user,
  error
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskForm>({
    defaultValues: {
      title: '',
      description: '',
      priority: Priority.MEDIUM,
      status: defaultStatus || TaskStatus.TODO,
      dueDate: '',
      assigneeId: task?.assigneeId || undefined,
    },
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const isAssignedUser = task?.assigneeId === user?.id;
  const isNew = !task;
  const canEdit = isAdmin && isNew;
  const canEditExisting = isAdmin;
  const canEditStatus = isAdmin || isAssignedUser;

  useEffect(() => {
    reset({
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || Priority.MEDIUM,
      status: task?.status || defaultStatus || TaskStatus.TODO,
      dueDate: task?.dueDate || '',
      assigneeId: task?.assigneeId,
    });
  }, [task, defaultStatus, reset]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await userService.getAll();
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to load users', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (open) fetchUsers();
  }, [open, isAdmin]);

  const onSubmit = (data: TaskForm) => {
    const taskToSave: Task = {
      ...data,
      id: task?.id ?? 0,
    };
    onSave(taskToSave);
  };

  const handleDelete = async () => {
    if (task?.id === undefined) return;

    if (task && window.confirm('Are you sure you want to delete this task?')) {
      setDeleting(true);
      onDelete(task.id);
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        {error && (
        <Alert severity="error" sx={{ m: 2 }}>
            {error}
        </Alert>
        )}

      <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}>
        {task ? 'Task Details' : 'Add Task'}
        <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            }}
        >
            <CloseIcon />
        </IconButton>
        </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={!canEditExisting && !canEdit}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="dense"
            {...register('description', { required: 'Description is required' })}
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={!canEditExisting && !canEdit}
          />

          <TextField
            label="Priority"
            select
            fullWidth
            margin="dense"
            defaultValue={Priority.MEDIUM}
            {...register('priority', { required: 'Priority is required' })}
            error={!!errors.priority}
            helperText={errors.priority?.message}
            disabled={!canEditExisting && !canEdit}
          >
            {Object.values(Priority).map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Status"
            select
            fullWidth
            margin="dense"
            defaultValue={defaultStatus || TaskStatus.TODO}
            {...register('status', { required: 'Status is required' })}
            error={!!errors.status}
            helperText={errors.status?.message}
            disabled={!canEditStatus}
          >
            {Object.values(TaskStatus).map((s) => (
              <MenuItem key={s} value={s}>
                {s.replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="dense"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            {...register('dueDate')}
            disabled={!canEditExisting && !canEdit}
          />

            <TextField
                label="Assignee"
                select
                fullWidth
                margin="dense"
                defaultValue={task?.assigneeId ?? ''}
                {...register('assigneeId')}
                disabled={loadingUsers || !isAdmin}
            >
                {loadingUsers ? (
                <MenuItem value="">
                    <CircularProgress size={20} />
                </MenuItem>
                ) : (
                users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                    {user.fullName} ({user.username})
                    </MenuItem>
                ))
                )}
            </TextField>
        </DialogContent>

        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
        {isAdmin && task && (
            <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
            >
            Delete
            </Button>
        )}

        <Box display="flex" gap={1} sx={{ ml: 'auto' }}>
        {(isAdmin || isAssignedUser) && (
            <Button type="submit" variant="contained" color="success">
            {task ? 'Update' : 'Save'}
            </Button>
        )}
        </Box>
        </DialogActions>

      </form>
    </Dialog>
  );
};

export default TaskModal;
