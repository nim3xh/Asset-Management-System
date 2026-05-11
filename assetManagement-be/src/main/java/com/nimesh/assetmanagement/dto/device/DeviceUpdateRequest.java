package com.nimesh.assetmanagement.dto.device;

import com.nimesh.assetmanagement.entity.AuditModifyUser;
import com.nimesh.assetmanagement.enums.DeviceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceUpdateRequest {
    private String serialNumber;
    private String assetTag;
    private Long brandId;
    private String model;
    private BigDecimal purchaseCost;
    private DeviceStatus currentStatus;
    private AuditModifyUser.Status status;
}
