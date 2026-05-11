package com.nimesh.assetmanagement.service.device;

import com.nimesh.assetmanagement.dto.device.DeviceCreateRequest;
import com.nimesh.assetmanagement.dto.device.DeviceResponse;
import com.nimesh.assetmanagement.dto.device.DeviceUpdateRequest;
import com.nimesh.assetmanagement.response.APIResponse;
import java.util.Map;
import org.springframework.data.domain.Page;

public interface DeviceService {
  APIResponse<Page<DeviceResponse>> getDevices(
      Map<String, String> filters,
      Integer page,
      Integer size,
      String sortField,
      String sortDirection);

  APIResponse<DeviceResponse> getDevice(String deviceId);

  APIResponse<DeviceResponse> createDevice(DeviceCreateRequest deviceRequest);

  APIResponse<DeviceResponse> updateDevice(String deviceId, DeviceUpdateRequest deviceRequest);

  APIResponse<Void> deleteDevice(String deviceId);
}
