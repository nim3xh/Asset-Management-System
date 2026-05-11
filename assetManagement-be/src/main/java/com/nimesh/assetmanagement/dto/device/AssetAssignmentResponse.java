package com.nimesh.assetmanagement.dto.device;

import com.nimesh.assetmanagement.dto.device.DeviceResponse;
import com.nimesh.assetmanagement.dto.device.UserResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetAssignmentResponse {
  private Long id;
  private Long userId;
  private Long deviceId;
  private LocalDate returnDate;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}

