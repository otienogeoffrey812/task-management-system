package com.example.task_management.dto.response.task;

import com.example.task_management.entity.enums.Priority;
import com.example.task_management.entity.enums.Status;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Status status;
    private Priority priority;

    private Long assigneeId;
    private String assigneeName;

    private Long creatorId;
    private String creatorName;

    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}