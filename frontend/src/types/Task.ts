import { TaskStatus, Priority } from '../constants/enums';

export interface Task {
  id?: number;
  title: string;
  description: string;
  dueDate?: string;
  priority: Priority;
  status: TaskStatus;
  assigneeId?: number;
  creatorId: number;
}
