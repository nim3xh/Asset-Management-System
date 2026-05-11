package com.nimesh.assetmanagement.controller.device;

import com.nimesh.assetmanagement.dto.device.DeviceCreateRequest;
import com.nimesh.assetmanagement.dto.device.DeviceResponse;
import com.nimesh.assetmanagement.dto.device.DeviceUpdateRequest;
import com.nimesh.assetmanagement.response.APIResponse;
import com.nimesh.assetmanagement.service.device.DeviceService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/${version}/device")
public class DeviceController {

  private final DeviceService deviceService;

  @PostMapping(value = "/create")
  public ResponseEntity<APIResponse<DeviceResponse>> create(
      @RequestBody @Valid final DeviceCreateRequest deviceRequest) {

    APIResponse<DeviceResponse> response = deviceService.createDevice(deviceRequest);

    return ResponseEntity.ok(response);
  }

  @GetMapping(value = "/get/{id}")
  public ResponseEntity<APIResponse<DeviceResponse>> getById(@PathVariable final String id) {

    APIResponse<DeviceResponse> response = deviceService.getDevice(id);

    return ResponseEntity.ok(response);
  }

  @PutMapping(value = "/update/{id}")
  public ResponseEntity<APIResponse<DeviceResponse>> update(
      @PathVariable final String id, @RequestBody @Valid final DeviceUpdateRequest deviceRequest) {

    APIResponse<DeviceResponse> response = deviceService.updateDevice(id, deviceRequest);

    return ResponseEntity.ok(response);
  }

  @PutMapping(value = "/delete/{id}")
  public ResponseEntity<APIResponse<Void>> delete(@PathVariable final String id) {

    APIResponse<Void> response = deviceService.deleteDevice(id);

    return ResponseEntity.ok(response);
  }

  @GetMapping(value = "/get/all")
  public ResponseEntity<APIResponse<Page<DeviceResponse>>> getAll(
      @RequestParam(defaultValue = "0") final Integer page,
      @RequestParam(defaultValue = "10") final Integer size,
      @RequestParam(defaultValue = "deviceId") final String sortField,
      @RequestParam(defaultValue = "desc") final String sortDirection,
      @RequestParam Map<String, String> allParams) {

    allParams.remove("sortField");
    allParams.remove("page");
    allParams.remove("size");
    allParams.remove("sortDirection");

    APIResponse<Page<DeviceResponse>> response =
        deviceService.getDevices(allParams, page, size, sortField, sortDirection);

    return ResponseEntity.ok(response);
  }
}
