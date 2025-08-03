package com.example.task_management.seeders;

import com.example.task_management.entity.Task;
import com.example.task_management.entity.User;
import com.example.task_management.entity.enums.Priority;
import com.example.task_management.entity.enums.Role;
import com.example.task_management.entity.enums.Status;
import com.example.task_management.repository.TaskRepository;
import com.example.task_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setFullName("Admin User");
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin@1234"));
            admin.setRole(Role.ADMIN);

            User user = new User();
            user.setFullName("Regular User");
            user.setUsername("user");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("user@1234"));
            user.setRole(Role.USER);

            userRepository.saveAll(List.of(admin, user));

            List<Task> tasks = List.of(
                    createTask("Setup project", "Initialize Spring Boot & React", Status.TODO, Priority.HIGH, admin),
                    createTask("Design DB schema", "Plan out database entities", Status.IN_PROGRESS, Priority.MEDIUM, admin),
                    createTask("Implement Auth", "JWT login/signup", Status.TODO, Priority.HIGH, user),
                    createTask("Create dashboard", "Frontend UI work", Status.DONE, Priority.LOW, user),
                    createTask("Write unit tests", "For controller and service", Status.IN_PROGRESS, Priority.MEDIUM, admin),
                    createTask("Configure CI/CD", "GitHub Actions setup", Status.TODO, Priority.HIGH, admin),
                    createTask("Add user profile page", "React component for user details", Status.TODO, Priority.LOW, user)
            );

            taskRepository.saveAll(tasks);

            System.out.println("Seed data created");
        }
    }

    private Task createTask(String title, String desc, Status status, Priority priority, User assignee) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(desc);
        task.setStatus(status);
        task.setPriority(priority);
        int offset = (int)(Math.random() * 20) - 10;
        task.setDueDate(LocalDate.now().plusDays(offset));
        task.setAssignee(assignee);
        return task;
    }
}
