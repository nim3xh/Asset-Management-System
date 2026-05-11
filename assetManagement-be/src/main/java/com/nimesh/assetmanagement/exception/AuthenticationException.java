package com.nimesh.assetmanagement.exception;

public class AuthenticationException extends AssetManagementException {
    public AuthenticationException(int statusCode, String responseBody) {
        super(statusCode, responseBody);
    }

    public AuthenticationException(String message) {
        super(message);
    }
}

