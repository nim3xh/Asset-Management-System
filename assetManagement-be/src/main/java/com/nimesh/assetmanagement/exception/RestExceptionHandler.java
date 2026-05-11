package com.nimesh.assetmanagement.exception;

import com.nimesh.assetmanagement.response.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionHandler {

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<APIResponse<Void>> handleAuthenticationException(
      AuthenticationException ex) {
    return ResponseEntity.status(ex.getStatusCode()).body(APIResponse.error(ex.getResponseBody()));
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<APIResponse<Void>> handleBadCredentials(BadCredentialsException ex) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        .body(APIResponse.error("Invalid email or password"));
  }

  @ExceptionHandler(UsernameNotFoundException.class)
  public ResponseEntity<APIResponse<Void>> handleUsernameNotFound(UsernameNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(APIResponse.error(ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<APIResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(APIResponse.error("Validation failed"));
  }
}
