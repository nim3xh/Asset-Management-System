package com.nimesh.assetmanagement.service.impl.device;

import com.nimesh.assetmanagement.dto.device.DeviceCreateRequest;
import com.nimesh.assetmanagement.dto.device.DeviceResponse;
import com.nimesh.assetmanagement.dto.device.DeviceUpdateRequest;
import com.nimesh.assetmanagement.response.APIResponse;
import com.nimesh.assetmanagement.service.device.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceServiceImpl implements DeviceService {
    @Override
    public APIResponse<List<DeviceResponse>> getDevices() {
        return null;
    }

    @Override
    public APIResponse<DeviceResponse> getDevice(String deviceId) {
        return null;
    }

    @Override
    public APIResponse<DeviceResponse> createDevice(DeviceCreateRequest deviceRequest) {
        return null;
    }

    @Override
    public APIResponse<DeviceResponse> updateDevice(String deviceId, DeviceUpdateRequest deviceRequest) {
        return null;
    }

    @Override
    public APIResponse<Void> deleteDevice(String deviceId) {
        return null;
    }
}
