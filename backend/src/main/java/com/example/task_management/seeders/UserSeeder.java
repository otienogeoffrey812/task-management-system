package com.example.task_management.seeders;

import com.example.task_management.entity.User;
import com.example.task_management.entity.enums.Role;
import com.example.task_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
@RequiredArgsConstructor
public class UserSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setFullName("Admin");
            admin.setPassword(passwordEncoder.encode("admin@1234"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            User user = new User();
            user.setUsername("user");
            user.setEmail("user@example.com");
            user.setFullName("User");
            user.setPassword(passwordEncoder.encode("user@1234"));
            user.setRole(Role.USER);
            userRepository.save(user);
        }
    }
}
