package com.nimesh.assetmanagement.controller.device;

import com.nimesh.assetmanagement.dto.device.AssetAssignmentCreateRequest;
import com.nimesh.assetmanagement.dto.device.AssetAssignmentResponse;
import com.nimesh.assetmanagement.dto.device.AssetAssignmentUpdateRequest;
import com.nimesh.assetmanagement.response.APIResponse;
import com.nimesh.assetmanagement.service.device.AssetAssignmentService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/${version}/assign")
public class AssetAssignmentController {

  private final AssetAssignmentService assetAssignmentService;

  @PostMapping(value = "/create")
  public ResponseEntity<APIResponse<AssetAssignmentResponse>> create(
      @RequestBody @Valid final AssetAssignmentCreateRequest request) {

    APIResponse<AssetAssignmentResponse> response =
        assetAssignmentService.createAssetAssignment(request);

    return ResponseEntity.ok(response);
  }

  @GetMapping(value = "/get/{id}")
  public ResponseEntity<APIResponse<AssetAssignmentResponse>> getById(
      @PathVariable final String id) {

    APIResponse<AssetAssignmentResponse> response = assetAssignmentService.getAssetAssignment(id);

    return ResponseEntity.ok(response);
  }

  @PutMapping(value = "/update/{id}")
  public ResponseEntity<APIResponse<AssetAssignmentResponse>> update(
      @PathVariable final String id,
      @RequestBody @Valid final AssetAssignmentUpdateRequest request) {

    APIResponse<AssetAssignmentResponse> response =
        assetAssignmentService.updateAssetAssignment(id, request);

    return ResponseEntity.ok(response);
  }

  @PutMapping(value = "/delete/{id}")
  public ResponseEntity<APIResponse<Void>> delete(@PathVariable final String id) {

    APIResponse<Void> response = assetAssignmentService.deleteAssetAssignment(id);

    return ResponseEntity.ok(response);
  }

  @PutMapping(value = "/return/{id}")
  public ResponseEntity<APIResponse<AssetAssignmentResponse>> returnDevice(
      @PathVariable final String id,
      @RequestParam("returnDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
          final LocalDate returnDate) {

    APIResponse<AssetAssignmentResponse> response =
        assetAssignmentService.returnDevice(id, returnDate);

    return ResponseEntity.ok(response);
  }

  @GetMapping(value = "/get/all")
  public ResponseEntity<APIResponse<Page<AssetAssignmentResponse>>> getAll(
      @RequestParam(defaultValue = "0") final Integer page,
      @RequestParam(defaultValue = "10") final Integer size,
      @RequestParam(defaultValue = "id") final String sortField,
      @RequestParam(defaultValue = "desc") final String sortDirection,
      @RequestParam Map<String, String> allParams) {

    allParams.remove("sortField");
    allParams.remove("page");
    allParams.remove("size");
    allParams.remove("sortDirection");

    APIResponse<Page<AssetAssignmentResponse>> response =
        assetAssignmentService.getAssetAssignments(allParams, page, size, sortField, sortDirection);

    return ResponseEntity.ok(response);
  }
}
