package com.nimesh.assetmanagement.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class AssetManagementException extends RuntimeException {

  private final int statusCode;
  private final String responseBody;

  public AssetManagementException(int statusCode, String responseBody) {
    super();
      this.statusCode = statusCode;
      this.responseBody = responseBody;
  }

  public AssetManagementException(String message) {
    super(message);
    this.statusCode = 0;
    this.responseBody = null;
  }

  public AssetManagementException(String message, Throwable cause, int statusCode, String responseBody) {
    super(message, cause);
      this.statusCode = statusCode;
      this.responseBody = responseBody;
  }

  public AssetManagementException(Throwable cause, int statusCode, String responseBody) {
    super(cause);
      this.statusCode = statusCode;
      this.responseBody = responseBody;
  }
}
