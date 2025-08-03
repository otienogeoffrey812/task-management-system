import axios from '../api/axiosInstance';

interface TaskPayload {
  title: string;
  description: string;
  status: string;
  dueDate?: string;
  priority: string;
  assignee?: string | number;
}

const taskService = {
  create: (data: TaskPayload) => axios.post('/tasks', data),

  getAll: () => axios.get('/tasks'),

  getById: (id: string | number) => axios.get(`/tasks/${id}`),

  update: (id: string | number, data: Partial<TaskPayload>) =>
    axios.put(`/tasks/${id}`, data),

  delete: (id: string | number) => axios.delete(`/tasks/${id}`),
};

export default taskService;