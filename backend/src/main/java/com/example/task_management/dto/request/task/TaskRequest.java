package com.example.task_management.dto.request.task;

import com.example.task_management.entity.enums.Priority;
import com.example.task_management.entity.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    private Status status;

    @NotNull(message = "Priority is required")
    private Priority priority;
    private Long assigneeId;
    private Long creatorId;
    private LocalDate dueDate;
}