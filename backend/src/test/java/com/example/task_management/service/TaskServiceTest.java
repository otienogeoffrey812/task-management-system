package com.example.task_management.service;

import com.example.task_management.dto.request.task.TaskRequest;
import com.example.task_management.dto.response.task.TaskResponse;
import com.example.task_management.entity.Task;
import com.example.task_management.entity.User;
import com.example.task_management.entity.enums.Priority;
import com.example.task_management.entity.enums.Status;
import com.example.task_management.repository.TaskRepository;
import com.example.task_management.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private AutoCloseable closeable;

    private TaskRequest taskRequest;
    private Task task;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);

        taskRequest = new TaskRequest();
        taskRequest.setTitle("Test Task");
        taskRequest.setDescription("Test Description");
        taskRequest.setStatus(Status.TODO);
        taskRequest.setPriority(Priority.HIGH);
        taskRequest.setDueDate(LocalDate.now().plusDays(2));

        task = new Task();
        task.setId(1L);
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setStatus(taskRequest.getStatus());
        task.setPriority(taskRequest.getPriority());
        task.setDueDate(taskRequest.getDueDate());
    }

    @Test
    void testCreateTask() {
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponse response = taskService.createTask(taskRequest);

        assertNotNull(response);
        assertEquals(taskRequest.getTitle(), response.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void testGetAllTasks_NoFilters() {
        when(taskRepository.findAll()).thenReturn(List.of(task));

        List<TaskResponse> tasks = taskService.getAllTasks(null, null);

        assertEquals(1, tasks.size());
        assertEquals(task.getTitle(), tasks.get(0).getTitle());
    }

    @Test
    void testGetAllTasks_ByStatusAndAssigneeId() {
        when(taskRepository.findByStatusAndAssigneeId("TODO", 1L)).thenReturn(List.of(task));

        List<TaskResponse> tasks = taskService.getAllTasks("TODO", 1L);

        assertEquals(1, tasks.size());
    }

    @Test
    void testUpdateTask_Found() {
        taskRequest.setAssigneeId(1L);
        User user = new User();
        user.setId(1L);
        user.setFullName("Jane Doe");

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        Optional<TaskResponse> response = taskService.updateTask(1L, taskRequest);

        assertTrue(response.isPresent());
        assertEquals(taskRequest.getTitle(), response.get().getTitle());
        assertEquals(user.getId(), response.get().getAssigneeId());
    }

    @Test
    void testUpdateTask_NotFound() {
        when(taskRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<TaskResponse> response = taskService.updateTask(1L, taskRequest);

        assertFalse(response.isPresent());
    }

    @Test
    void testDeleteTask() {
        doNothing().when(taskRepository).deleteById(1L);

        taskService.deleteTask(1L);

        verify(taskRepository, times(1)).deleteById(1L);
    }

    @Test
    void testGetTaskById() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        Optional<TaskResponse> response = taskService.getTaskById(1L);

        assertTrue(response.isPresent());
        assertEquals(task.getTitle(), response.get().getTitle());
    }
}