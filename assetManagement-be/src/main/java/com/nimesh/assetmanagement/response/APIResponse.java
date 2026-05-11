package com.nimesh.assetmanagement.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class APIResponse<T> {
    private String message;
    private T data;

    public static <T> APIResponse<T> success(T data){
        return APIResponse.<T>builder()
                .data(data)
                .message("Success")
                .build();
    }

    public static <T> APIResponse<T> error(String message){
        return APIResponse.<T>builder()
                .message(message)
                .build();
    }
}
