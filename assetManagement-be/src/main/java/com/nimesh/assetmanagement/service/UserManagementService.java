package com.nimesh.assetmanagement.service;

import com.nimesh.assetmanagement.dto.user.UserManagementCreateRequest;
import com.nimesh.assetmanagement.dto.user.UserManagementResponse;
import com.nimesh.assetmanagement.dto.user.UserManagementUpdateRequest;
import com.nimesh.assetmanagement.response.APIResponse;
import java.util.Map;
import org.springframework.data.domain.Page;

public interface UserManagementService {
  APIResponse<Page<UserManagementResponse>> getUsers(
      Map<String, String> filters,
      Integer page,
      Integer size,
      String sortField,
      String sortDirection);

  APIResponse<UserManagementResponse> getUser(String userId);

  APIResponse<UserManagementResponse> createUser(UserManagementCreateRequest request);

  APIResponse<UserManagementResponse> updateUser(
      String userId, UserManagementUpdateRequest request);

  APIResponse<Void> deleteUser(String userId);
}
