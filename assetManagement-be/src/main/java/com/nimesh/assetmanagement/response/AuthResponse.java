package com.nimesh.assetmanagement.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nimesh.assetmanagement.entity.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {
    private int statusCode;
    private String error;
    private String message;
    private String data;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String name;
    private String email;
    private String role;
    private User user;
}
