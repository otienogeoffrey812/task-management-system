package com.example.task_management.service;

import com.example.task_management.dto.request.user.LoginRequest;
import com.example.task_management.dto.request.user.RegisterRequest;
import com.example.task_management.dto.response.ApiResponse;
import com.example.task_management.dto.response.user.AuthResponse;
import com.example.task_management.dto.response.user.UserResponse;
import com.example.task_management.entity.User;
import com.example.task_management.entity.enums.Role;
import com.example.task_management.repository.UserRepository;
import com.example.task_management.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public ApiResponse<AuthResponse> register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        var user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername());

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setFullName(user.getFullName());
        userResponse.setRole(user.getRole());

        var authResponse = new AuthResponse(token, userResponse);
        return ApiResponse.success("User registered successfully", authResponse);
    }

    public ApiResponse<AuthResponse> login(LoginRequest request) {
        var user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername());

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setFullName(user.getFullName());
        userResponse.setRole(user.getRole());

        AuthResponse authResponse = new AuthResponse(token, userResponse);

        return ApiResponse.success("Login successful", authResponse);
    }
}