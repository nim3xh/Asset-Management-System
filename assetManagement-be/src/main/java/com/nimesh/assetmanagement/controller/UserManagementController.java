package com.nimesh.assetmanagement.controller;

import com.nimesh.assetmanagement.dto.user.UserManagementCreateRequest;
import com.nimesh.assetmanagement.dto.user.UserManagementResponse;
import com.nimesh.assetmanagement.dto.user.UserManagementUpdateRequest;
import com.nimesh.assetmanagement.response.APIResponse;
import com.nimesh.assetmanagement.service.UserManagementService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/${version}/user-management")
public class UserManagementController {

  private final UserManagementService userManagementService;

  @PostMapping(value = "/create")
  public ResponseEntity<APIResponse<UserManagementResponse>> create(
      @RequestBody @Valid final UserManagementCreateRequest request) {
    APIResponse<UserManagementResponse> response = userManagementService.createUser(request);
    return ResponseEntity.ok(response);
  }

  @GetMapping(value = "/get/{id}")
  public ResponseEntity<APIResponse<UserManagementResponse>> getById(
      @PathVariable final String id) {

    APIResponse<UserManagementResponse> response = userManagementService.getUser(id);

    return ResponseEntity.ok(response);
  }

  @PutMapping(value = "/update/{id}")
  public ResponseEntity<APIResponse<UserManagementResponse>> update(
      @PathVariable final String id,
      @RequestBody @Valid final UserManagementUpdateRequest request) {

    APIResponse<UserManagementResponse> response = userManagementService.updateUser(id, request);

    return ResponseEntity.ok(response);
  }

  @PutMapping(value = "/delete/{id}")
  public ResponseEntity<APIResponse<Void>> delete(@PathVariable final String id) {

    APIResponse<Void> response = userManagementService.deleteUser(id);

    return ResponseEntity.ok(response);
  }

  @GetMapping(value = "/get/all")
  public ResponseEntity<APIResponse<Page<UserManagementResponse>>> getAll(
      @RequestParam(defaultValue = "0") final Integer page,
      @RequestParam(defaultValue = "10") final Integer size,
      @RequestParam(defaultValue = "userId") final String sortField,
      @RequestParam(defaultValue = "desc") final String sortDirection,
      @RequestParam Map<String, String> allParams) {

    allParams.remove("sortField");
    allParams.remove("page");
    allParams.remove("size");
    allParams.remove("sortDirection");

    APIResponse<Page<UserManagementResponse>> response =
        userManagementService.getUsers(allParams, page, size, sortField, sortDirection);

    return ResponseEntity.ok(response);
  }
}
