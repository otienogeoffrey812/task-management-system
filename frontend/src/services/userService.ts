import axios from '../api/axiosInstance';

const userService = {
  getAll: () => axios.get('/users'),
};

export default userService;
