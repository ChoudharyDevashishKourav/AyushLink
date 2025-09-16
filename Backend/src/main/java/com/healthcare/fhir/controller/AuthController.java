
// AuthController.java
package com.healthcare.fhir.controller;

import com.healthcare.fhir.entity.Role;
import com.healthcare.fhir.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.healthcare.fhir.dto.ApiResponse;
import com.healthcare.fhir.dto.JwtAuthenticationResponse;
import com.healthcare.fhir.dto.LoginRequest;
import com.healthcare.fhir.dto.SignUpRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            String jwt = authService.authenticateUser(loginRequest.getUsername(), loginRequest.getPassword());
            logger.info("User logged in successfully: {}", loginRequest.getUsername());
            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
        } catch (Exception e) {
            logger.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid credentials!"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            authService.registerUser(
                    signUpRequest.getUsername(),
                    signUpRequest.getPassword(),
                    Set.of(Role.ROLE_USER)
            );

            logger.info("User registered successfully: {}", signUpRequest.getUsername());
            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", signUpRequest.getUsername(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            authService.registerUser(
                    signUpRequest.getUsername(),
                    signUpRequest.getPassword(),
                    Set.of(Role.ROLE_ADMIN, Role.ROLE_USER)
            );

            logger.info("Admin registered successfully: {}", signUpRequest.getUsername());
            return ResponseEntity.ok(new ApiResponse(true, "Admin registered successfully"));
        } catch (Exception e) {
            logger.error("Admin registration failed for user: {}", signUpRequest.getUsername(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
