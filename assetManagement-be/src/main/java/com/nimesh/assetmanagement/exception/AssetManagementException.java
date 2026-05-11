package com.nimesh.assetmanagement.exception;

public class AssetManagementException extends RuntimeException {
  public AssetManagementException() {
    super();
  }

  public AssetManagementException(String message) {
    super(message);
  }

  public AssetManagementException(String message, Throwable cause) {
    super(message, cause);
  }

  public AssetManagementException(Throwable cause) {
    super(cause);
  }


}
