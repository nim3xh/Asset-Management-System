package com.nimesh.assetmanagement.service.impl.device;

import com.nimesh.assetmanagement.dto.device.DeviceCreateRequest;
import com.nimesh.assetmanagement.dto.device.DeviceResponse;
import com.nimesh.assetmanagement.dto.device.DeviceUpdateRequest;
import com.nimesh.assetmanagement.entity.AuditModifyUser;
import com.nimesh.assetmanagement.entity.device.Device;
import com.nimesh.assetmanagement.exception.AssetManagementException;
import com.nimesh.assetmanagement.repository.device.DeviceRepository;
import com.nimesh.assetmanagement.response.APIResponse;
import com.nimesh.assetmanagement.service.device.DeviceService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeviceServiceImpl implements DeviceService {

  private final DeviceRepository deviceRepository;

  @Override
  public APIResponse<Page<DeviceResponse>> getDevices(
      Map<String, String> filters,
      Integer page,
      Integer size,
      String sortField,
      String sortDirection) {
    int pageNumber = page != null && page >= 0 ? page : 0;
    int pageSize = size != null && size > 0 ? size : 20;
    String resolvedSortField = (sortField == null || sortField.isBlank()) ? "deviceId" : sortField;
    Sort.Direction direction =
        "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;

    Specification<Device> specification =
        (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();
    Page<Device> devicePage =
        deviceRepository.findAll(
            specification,
            PageRequest.of(pageNumber, pageSize, Sort.by(direction, resolvedSortField)));

    return APIResponse.success(devicePage.map(this::toResponse));
  }

  @Override
  public APIResponse<DeviceResponse> getDevice(String deviceId) {
    Device device = isDeviceExists(deviceId);
    return APIResponse.success(toResponse(device));
  }

  @Override
  public APIResponse<DeviceResponse> createDevice(DeviceCreateRequest deviceRequest) {
    Device device =
        Device.builder()
            .serialNumber(deviceRequest.getSerialNumber())
            .assetTag(deviceRequest.getAssetTag())
            .brand(deviceRequest.getBrand())
            .model(deviceRequest.getModel())
            .purchaseCost(deviceRequest.getPurchaseCost())
            .currentStatus(deviceRequest.getCurrentStatus())
            .status(AuditModifyUser.Status.ACTIVE)
            .build();

    return APIResponse.success(toResponse(deviceRepository.save(device)));
  }

  @Override
  public APIResponse<DeviceResponse> updateDevice(
      String deviceId, DeviceUpdateRequest deviceRequest) {
    Device device = isDeviceExists(deviceId);

    device.setSerialNumber(deviceRequest.getSerialNumber());
    device.setAssetTag(deviceRequest.getAssetTag());
    device.setBrand(deviceRequest.getBrand());
    device.setModel(deviceRequest.getModel());
    device.setPurchaseCost(deviceRequest.getPurchaseCost());
    device.setCurrentStatus(deviceRequest.getCurrentStatus());
    device.setStatus(deviceRequest.getStatus());

    return APIResponse.success(toResponse(deviceRepository.saveAndFlush(device)));
  }

  @Override
  public APIResponse<Void> deleteDevice(String deviceId) {
    Device device = isDeviceExists(deviceId);
    device.setStatus(AuditModifyUser.Status.INACTIVE);
    deviceRepository.saveAndFlush(device);
    return APIResponse.success(null);
  }

  private DeviceResponse toResponse(Device device) {
    return DeviceResponse.builder()
        .deviceId(device.getDeviceId())
        .serialNumber(device.getSerialNumber())
        .assetTag(device.getAssetTag())
        .brand(device.getBrand())
        .model(device.getModel())
        .purchaseCost(device.getPurchaseCost())
        .currentStatus(device.getCurrentStatus())
        .status(device.getStatus())
        .createdAt(device.getCreatedDateTime())
        .updatedAt(device.getModifiedDateTime())
        .build();
  }

  private Device isDeviceExists(String deviceId) {
    try {
      Long id = Long.valueOf(deviceId);
      return deviceRepository
          .findById(id)
          .orElseThrow(
              () -> new AssetManagementException(HttpStatus.NOT_FOUND.value(), "Device not found"));
    } catch (NumberFormatException ex) {
      throw new AssetManagementException(HttpStatus.BAD_REQUEST.value(), "Invalid device id");
    }
  }
}
