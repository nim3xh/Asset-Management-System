package com.nimesh.assetmanagement.dto.device;

import com.nimesh.assetmanagement.entity.device.Brand;
import com.nimesh.assetmanagement.enums.DeviceStatus;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceCreateRequest {
  private String serialNumber;
  private String assetTag;
  private Brand brand;
  private String model;
  private BigDecimal purchaseCost;
  private DeviceStatus currentStatus;
}
