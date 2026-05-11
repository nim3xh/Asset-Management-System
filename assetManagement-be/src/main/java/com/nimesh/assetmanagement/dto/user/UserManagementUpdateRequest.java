package com.nimesh.assetmanagement.dto.user;

import com.nimesh.assetmanagement.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementUpdateRequest {
  private String firstName;
  private String lastName;
  private String middleName;
  private String email;
  private String password;
  private Boolean isActive;
  private Role role;
}

