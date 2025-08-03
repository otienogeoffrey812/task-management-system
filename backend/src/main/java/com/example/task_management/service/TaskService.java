package com.example.task_management.service;

import com.example.task_management.dto.request.task.TaskRequest;
import com.example.task_management.dto.response.task.TaskResponse;
import com.example.task_management.entity.Task;
import com.example.task_management.entity.User;
import com.example.task_management.repository.TaskRepository;
import com.example.task_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskResponse createTask(TaskRequest request) {
        Task task = mapToEntity(request);
        return mapToResponse(taskRepository.save(task));
    }

    public List<TaskResponse> getAllTasks(String status, Long assigneeId) {
        List<Task> tasks;

        if (status != null && assigneeId != null) {
            tasks = taskRepository.findByStatusAndAssigneeId(status, assigneeId);
        } else if (status != null) {
            tasks = taskRepository.findByStatus(status);
        } else if (assigneeId != null) {
            tasks = taskRepository.findByAssigneeId(assigneeId);
        } else {
            tasks = taskRepository.findAll();
        }

        return tasks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Optional<TaskResponse> updateTask(Long id, TaskRequest request) {
        return taskRepository.findById(id).map(existingTask -> {
            existingTask.setTitle(request.getTitle());
            existingTask.setDescription(request.getDescription());
            existingTask.setStatus(request.getStatus());
            existingTask.setPriority(request.getPriority());

            if (request.getAssigneeId() != null) {
                User user = userRepository.findById(Long.parseLong(request.getAssigneeId().toString()))
                        .orElse(null);
                existingTask.setAssignee(user);
            } else {
                existingTask.setAssignee(null);
            }

            existingTask.setDueDate(request.getDueDate());
            Task updated = taskRepository.save(existingTask);
            return mapToResponse(updated);
        });
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Optional<TaskResponse> getTaskById(Long id) {
        return taskRepository.findById(id).map(this::mapToResponse);
    }

    private Task mapToEntity(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {
            userRepository.findById(Long.parseLong(request.getAssigneeId().toString()))
                    .ifPresent(task::setAssignee);
        }

        return task;
    }

    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .assigneeId(task.getAssignee() != null ? task.getAssignee().getId() : null)
                .assigneeName(task.getAssignee() != null ? task.getAssignee().getFullName() : null)
                .build();
    }
}