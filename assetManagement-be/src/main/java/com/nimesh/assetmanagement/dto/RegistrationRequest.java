package com.nimesh.assetmanagement.dto;

import com.nimesh.assetmanagement.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequest {
    private String firstName;
    private String lastName;
    private String middleName;
    private String email;
    private String password;
    private Role role;
}
