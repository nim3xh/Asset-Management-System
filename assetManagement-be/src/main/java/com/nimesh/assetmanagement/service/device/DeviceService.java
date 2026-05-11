package com.nimesh.assetmanagement.service.device;

import com.nimesh.assetmanagement.dto.device.DeviceCreateRequest;
import com.nimesh.assetmanagement.dto.device.DeviceResponse;
import com.nimesh.assetmanagement.dto.device.DeviceUpdateRequest;
import com.nimesh.assetmanagement.response.APIResponse;

import java.util.List;

public interface DeviceService {
    APIResponse<List<DeviceResponse>> getDevices();

    APIResponse<DeviceResponse> getDevice(String deviceId);

    APIResponse<DeviceResponse> createDevice(DeviceCreateRequest deviceRequest);

    APIResponse<DeviceResponse> updateDevice(String deviceId, DeviceUpdateRequest deviceRequest);

    APIResponse<Void> deleteDevice(String deviceId);
}
