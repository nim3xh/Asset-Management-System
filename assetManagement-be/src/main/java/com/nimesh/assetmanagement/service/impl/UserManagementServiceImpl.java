package com.nimesh.assetmanagement.service.impl;

import com.nimesh.assetmanagement.dto.user.UserManagementCreateRequest;
import com.nimesh.assetmanagement.dto.user.UserManagementResponse;
import com.nimesh.assetmanagement.dto.user.UserManagementUpdateRequest;
import com.nimesh.assetmanagement.entity.User;
import com.nimesh.assetmanagement.enums.Role;
import com.nimesh.assetmanagement.exception.AssetManagementException;
import com.nimesh.assetmanagement.repository.UserRepository;
import com.nimesh.assetmanagement.response.APIResponse;
import com.nimesh.assetmanagement.service.UserManagementService;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserManagementServiceImpl implements UserManagementService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public APIResponse<Page<UserManagementResponse>> getUsers(
      Map<String, String> filters,
      Integer page,
      Integer size,
      String sortField,
      String sortDirection) {

    int pageNumber = page != null && page >= 0 ? page : 0;
    int pageSize = size != null && size > 0 ? size : 20;
    String resolvedSortField = (sortField == null || sortField.isBlank()) ? "userId" : sortField;
    Sort.Direction direction =
        "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;

    Specification<User> specification =
        (root, query, cb) -> {
          List<Predicate> predicates = new ArrayList<>();

          if (filters != null) {
            String email = filters.get("email");
            if (email != null && !email.isBlank()) {
              predicates.add(cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%"));
            }

            String role = filters.get("role");
            if (role != null && !role.isBlank()) {
              try {
                predicates.add(cb.equal(root.get("role"), Role.valueOf(role)));
              } catch (IllegalArgumentException ignored) {
              }
            }

            String isActive = filters.get("isActive");
            if (isActive != null && !isActive.isBlank()) {
              predicates.add(cb.equal(root.get("isActive"), Boolean.valueOf(isActive)));
            }

            String name = filters.get("name");
            if (name != null && !name.isBlank()) {
              String like = "%" + name.toLowerCase() + "%";
              predicates.add(
                  cb.or(
                      cb.like(cb.lower(root.get("firstName")), like),
                      cb.like(cb.lower(root.get("lastName")), like),
                      cb.like(cb.lower(root.get("middleName")), like)));
            }
          }

          return cb.and(predicates.toArray(new Predicate[0]));
        };

    Page<User> userPage =
        userRepository.findAll(
            specification,
            PageRequest.of(pageNumber, pageSize, Sort.by(direction, resolvedSortField)));

    return APIResponse.success(userPage.map(this::toResponse));
  }

  @Override
  public APIResponse<UserManagementResponse> getUser(String userId) {
    User user = isUserExists(userId);
    return APIResponse.success(toResponse(user));
  }

  @Override
  public APIResponse<UserManagementResponse> createUser(UserManagementCreateRequest request) {
    if (request.getEmail() == null || request.getEmail().isBlank()) {
      throw new AssetManagementException(HttpStatus.BAD_REQUEST.value(), "Email is required");
    }

    if (userRepository.existsByEmailAndIsActive(request.getEmail(), true)) {
      throw new AssetManagementException(HttpStatus.CONFLICT.value(), "Email already exists");
    }

    User user =
        User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .middleName(request.getMiddleName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .isActive(true)
            .role(request.getRole() != null ? request.getRole() : Role.IT_STAFF)
            .build();

    return APIResponse.success(toResponse(userRepository.save(user)));
  }

  @Override
  public APIResponse<UserManagementResponse> updateUser(
      String userId, UserManagementUpdateRequest request) {
    User user = isUserExists(userId);

    if (request.getEmail() != null && !request.getEmail().isBlank()) {
      if (!request.getEmail().equalsIgnoreCase(user.getEmail())
          && userRepository.existsByEmailAndIsActive(request.getEmail(), true)) {
        throw new AssetManagementException(HttpStatus.CONFLICT.value(), "Email already exists");
      }
      user.setEmail(request.getEmail());
    }

    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setMiddleName(request.getMiddleName());

    if (request.getPassword() != null && !request.getPassword().isBlank()) {
      user.setPassword(passwordEncoder.encode(request.getPassword()));
    }

    if (request.getIsActive() != null) {
      user.setIsActive(request.getIsActive());
    }

    if (request.getRole() != null) {
      user.setRole(request.getRole());
    }

    return APIResponse.success(toResponse(userRepository.saveAndFlush(user)));
  }

  @Override
  public APIResponse<Void> deleteUser(String userId) {
    User user = isUserExists(userId);
    user.setIsActive(false);
    userRepository.saveAndFlush(user);
    return APIResponse.success(null);
  }

  private UserManagementResponse toResponse(User user) {
    return UserManagementResponse.builder()
        .userId(user.getUserId())
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .middleName(user.getMiddleName())
        .email(user.getEmail())
        .isActive(user.getIsActive())
        .role(user.getRole())
        .build();
  }

  private User isUserExists(String userId) {
    try {
      Long id = Long.valueOf(userId);
      return userRepository
          .findById(id)
          .orElseThrow(
              () -> new AssetManagementException(HttpStatus.NOT_FOUND.value(), "User not found"));
    } catch (NumberFormatException ex) {
      throw new AssetManagementException(HttpStatus.BAD_REQUEST.value(), "Invalid user id");
    }
  }
}
