package com.example.task_management.service;

import com.example.task_management.dto.request.user.LoginRequest;
import com.example.task_management.dto.request.user.RegisterRequest;
import com.example.task_management.dto.response.ApiResponse;
import com.example.task_management.dto.response.user.AuthResponse;
import com.example.task_management.entity.User;
import com.example.task_management.entity.enums.Role;
import com.example.task_management.repository.UserRepository;
import com.example.task_management.security.JwtUtil;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private AutoCloseable closeable;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("jdoe");
        registerRequest.setEmail("jdoe@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFullName("John Doe");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("jdoe");
        loginRequest.setPassword("password123");

        user = new User();
        user.setId(1L);
        user.setUsername("jdoe");
        user.setEmail("jdoe@example.com");
        user.setFullName("John Doe");
        user.setRole(Role.USER);
        user.setPassword("encodedPassword");
    }

    @Test
    void testRegister_Success() {
        when(userRepository.existsByUsername("jdoe")).thenReturn(false);
        when(userRepository.existsByEmail("jdoe@example.com")).thenReturn(false);
        when(encoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken("jdoe")).thenReturn("mock-jwt-token");

        ApiResponse<AuthResponse> response = authService.register(registerRequest);

        assertTrue(response.isSuccess());
        assertEquals("User registered successfully", response.getMessage());
        assertNotNull(response.getData().getToken());
        assertEquals("jdoe", response.getData().getUser().getUsername());

        verify(userRepository).save(any(User.class));
    }

    @Test
    void testRegister_UsernameExists() {
        when(userRepository.existsByUsername("jdoe")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                authService.register(registerRequest));

        assertEquals("Username already exists", ex.getMessage());
    }

    @Test
    void testRegister_EmailExists() {
        when(userRepository.existsByUsername("jdoe")).thenReturn(false);
        when(userRepository.existsByEmail("jdoe@example.com")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                authService.register(registerRequest));

        assertEquals("Email already exists", ex.getMessage());
    }

    @Test
    void testLogin_Success() {
        when(userRepository.findByUsernameOrEmail("jdoe", "jdoe")).thenReturn(Optional.of(user));
        when(encoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("jdoe")).thenReturn("mock-jwt-token");

        ApiResponse<AuthResponse> response = authService.login(loginRequest);

        assertTrue(response.isSuccess());
        assertEquals("Login successful", response.getMessage());
        assertEquals("jdoe", response.getData().getUser().getUsername());
    }

    @Test
    void testLogin_InvalidUser() {
        when(userRepository.findByUsernameOrEmail("jdoe", "jdoe")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
    }

    @Test
    void testLogin_InvalidPassword() {
        when(userRepository.findByUsernameOrEmail("jdoe", "jdoe")).thenReturn(Optional.of(user));
        when(encoder.matches("password123", "encodedPassword")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login(loginRequest));
    }
}
