package com.nimesh.assetmanagement.service.impl;

import com.nimesh.assetmanagement.dto.LoginRequest;
import com.nimesh.assetmanagement.dto.RegistrationRequest;
import com.nimesh.assetmanagement.entity.User;
import com.nimesh.assetmanagement.enums.Role;
import com.nimesh.assetmanagement.exception.AuthenticationException;
import com.nimesh.assetmanagement.repository.UserRepository;
import com.nimesh.assetmanagement.response.APIResponse;
import com.nimesh.assetmanagement.response.AuthResponse;
import com.nimesh.assetmanagement.utility.JWTUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JWTUtils jwtUtils;
  private final AuthenticationManager authenticationManager;

  public APIResponse<AuthResponse> register(RegistrationRequest request) {
    if (userRepository.existsByEmailAndIsActive(request.getEmail(), true)) {
      throw new AuthenticationException(HttpStatus.CONFLICT.value(), "Email already exists");
    }

    User savedUser = userRepository.save(buildUser(request));

    return APIResponse.success(
        AuthResponse.builder().user(safeUser(savedUser)).message("User registration successful").build());
  }

  private User buildUser(RegistrationRequest request) {
    return User.builder()
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .middleName(request.getMiddleName())
        .email(request.getEmail())
        .isActive(true)
        .role(request.getRole() != null ? request.getRole() : Role.IT_STAFF)
        .password(passwordEncoder.encode(request.getPassword()))
        .build();
  }

  public APIResponse<AuthResponse> login(LoginRequest request) {
    try {
      authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
    } catch (BadCredentialsException ex) {
      throw new AuthenticationException(HttpStatus.UNAUTHORIZED.value(), "Invalid email or password");
    }

    User user =
        userRepository
            .findByEmailAndIsActive(request.getEmail(), true)
            .orElseThrow(
                () -> new AuthenticationException(HttpStatus.NOT_FOUND.value(), "Active user not found"));

    String token = jwtUtils.generateToken(user, user.getUserId());

    return APIResponse.success(
        AuthResponse.builder()
            .token(token)
            .role(user.getRole() != null ? user.getRole().name() : null)
            .user(safeUser(user))
            .expirationTime("24h")
            .message("Login successful")
            .build());
  }

  private User safeUser(User user) {
    return User.builder()
        .userId(user.getUserId())
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .middleName(user.getMiddleName())
        .email(user.getEmail())
        .isActive(user.getIsActive())
        .role(user.getRole())
        .build();
  }
}
