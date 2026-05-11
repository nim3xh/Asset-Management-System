package com.nimesh.assetmanagement.service.device;

import com.nimesh.assetmanagement.dto.device.AssetAssignmentCreateRequest;
import com.nimesh.assetmanagement.dto.device.AssetAssignmentResponse;
import com.nimesh.assetmanagement.dto.device.AssetAssignmentUpdateRequest;
import com.nimesh.assetmanagement.response.APIResponse;
import java.time.LocalDate;
import java.util.Map;
import org.springframework.data.domain.Page;

public interface AssetAssignmentService {
  APIResponse<Page<AssetAssignmentResponse>> getAssetAssignments(
      Map<String, String> filters,
      Integer page,
      Integer size,
      String sortField,
      String sortDirection);

  APIResponse<AssetAssignmentResponse> getAssetAssignment(String id);

  APIResponse<AssetAssignmentResponse> createAssetAssignment(AssetAssignmentCreateRequest request);

  APIResponse<AssetAssignmentResponse> updateAssetAssignment(
      String id, AssetAssignmentUpdateRequest request);

  APIResponse<Void> deleteAssetAssignment(String id);

  APIResponse<AssetAssignmentResponse> returnDevice(String id, LocalDate returnDate);
}
