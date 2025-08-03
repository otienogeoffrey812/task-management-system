package com.example.task_management.controller;

import com.example.task_management.dto.request.user.LoginRequest;
import com.example.task_management.dto.request.user.RegisterRequest;
import com.example.task_management.dto.response.ApiResponse;
import com.example.task_management.dto.response.user.AuthResponse;
import com.example.task_management.dto.response.user.UserResponse;
import com.example.task_management.entity.enums.Role;
import com.example.task_management.security.JwtFilter;
import com.example.task_management.security.JwtUtil;
import com.example.task_management.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtFilter jwtFilter;

    @MockitoBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private UserResponse userResponse;
    private AuthResponse authResponse;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("jdoe");
        registerRequest.setEmail("jdoe@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("John Doe");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("jdoe");
        loginRequest.setPassword("password123");

        userResponse = new UserResponse();
        userResponse.setId(1L);
        userResponse.setUsername("jdoe");
        userResponse.setEmail("jdoe@example.com");
        userResponse.setFullName("John Doe");
        userResponse.setRole(Role.USER);

        authResponse = new AuthResponse("mock-jwt-token", userResponse);
    }

    @Test
    void testRegister_Success() throws Exception {
        ApiResponse<AuthResponse> response = ApiResponse.success("User registered successfully", authResponse);
        Mockito.when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andExpect(jsonPath("$.data.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.data.user.username").value("jdoe"));
    }

    @Test
    void testLogin_Success() throws Exception {
        ApiResponse<AuthResponse> response = ApiResponse.success("Login successful", authResponse);
        Mockito.when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.data.user.username").value("jdoe"));
    }

    @Test
    void testRegister_InvalidInput() throws Exception {
        RegisterRequest badRequest = new RegisterRequest();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testLogin_InvalidInput() throws Exception {
        LoginRequest badLogin = new LoginRequest();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badLogin)))
                .andExpect(status().isBadRequest());
    }
}