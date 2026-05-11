package com.nimesh.assetmanagement.controller;

import com.nimesh.assetmanagement.dto.LoginRequest;
import com.nimesh.assetmanagement.dto.RegistrationRequest;
import com.nimesh.assetmanagement.response.APIResponse;
import com.nimesh.assetmanagement.response.AuthResponse;
import com.nimesh.assetmanagement.service.impl.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(value = "/api/${version}/auth/user")
@RequiredArgsConstructor
@RestController
public class UserController {
  private final AuthenticationService authenticationService;

  @PostMapping(value = "/register")
  ResponseEntity<APIResponse<AuthResponse>> register(
      @RequestBody RegistrationRequest registrationRequest) {

    APIResponse<AuthResponse> response = authenticationService.register(registrationRequest);

    return ResponseEntity.ok(response);
  }

  @PostMapping(value = "/login")
  ResponseEntity<APIResponse<AuthResponse>> login(@RequestBody LoginRequest request) {

    APIResponse<AuthResponse> response = authenticationService.login(request);

    return ResponseEntity.ok(response);
  }
}
