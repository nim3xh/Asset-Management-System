package com.nimesh.assetmanagement.dto.device;

import com.nimesh.assetmanagement.entity.AuditModifyUser;
import com.nimesh.assetmanagement.entity.device.Brand;
import com.nimesh.assetmanagement.enums.DeviceStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceResponse {
  private Long deviceId;
  private String serialNumber;
  private String assetTag;
  private Brand brand;
  private String model;
  private BigDecimal purchaseCost;
  private DeviceStatus currentStatus;
  private String status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
