package com.nimesh.assetmanagement.service.impl.device;

import com.nimesh.assetmanagement.dto.device.AssetAssignmentCreateRequest;
import com.nimesh.assetmanagement.dto.device.AssetAssignmentResponse;
import com.nimesh.assetmanagement.dto.device.AssetAssignmentUpdateRequest;
import com.nimesh.assetmanagement.entity.AuditModifyUser;
import com.nimesh.assetmanagement.entity.device.AssetAssignment;
import com.nimesh.assetmanagement.entity.device.Device;
import com.nimesh.assetmanagement.entity.User;
import com.nimesh.assetmanagement.enums.DeviceStatus;
import com.nimesh.assetmanagement.enums.Role;
import com.nimesh.assetmanagement.exception.AssetManagementException;
import com.nimesh.assetmanagement.repository.device.AssetAssignmentRepository;
import com.nimesh.assetmanagement.repository.device.DeviceRepository;
import com.nimesh.assetmanagement.repository.UserRepository;
import com.nimesh.assetmanagement.response.APIResponse;
import com.nimesh.assetmanagement.service.device.AssetAssignmentService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssetAssignmentServiceImpl implements AssetAssignmentService {

  private final AssetAssignmentRepository assetAssignmentRepository;
  private final UserRepository userRepository;
  private final DeviceRepository deviceRepository;

  @Override
  public APIResponse<Page<AssetAssignmentResponse>> getAssetAssignments(
      Map<String, String> filters,
      Integer page,
      Integer size,
      String sortField,
      String sortDirection) {
    int pageNumber = page != null && page >= 0 ? page : 0;
    int pageSize = size != null && size > 0 ? size : 20;
    String resolvedSortField = (sortField == null || sortField.isBlank()) ? "id" : sortField;
    Sort.Direction direction =
        "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;

    Specification<AssetAssignment> specification =
        (root, query, cb) -> {
          List<Predicate> predicates = new ArrayList<>();

          if (filters != null) {
            if (filters.containsKey("userId")
                && filters.get("userId") != null
                && !filters.get("userId").isBlank()) {
              try {
                Long uid = Long.valueOf(filters.get("userId"));
                predicates.add(cb.equal(root.get("user").get("userId"), uid));
              } catch (NumberFormatException ignored) {
              }
            }

            if (filters.containsKey("deviceId")
                && filters.get("deviceId") != null
                && !filters.get("deviceId").isBlank()) {
              try {
                Long did = Long.valueOf(filters.get("deviceId"));
                predicates.add(cb.equal(root.get("device").get("deviceId"), did));
              } catch (NumberFormatException ignored) {
              }
            }

            if (filters.containsKey("role")
                && filters.get("role") != null
                && !filters.get("role").isBlank()) {
              try {
                Role r = Role.valueOf(filters.get("role"));
                predicates.add(cb.equal(root.get("user").get("role"), r));
              } catch (IllegalArgumentException ignored) {
              }
            }

            if (filters.containsKey("status")
                && filters.get("status") != null
                && !filters.get("status").isBlank()) {
              try {
                AuditModifyUser.Status s = AuditModifyUser.Status.valueOf(filters.get("status"));
                predicates.add(cb.equal(root.get("status"), s));
              } catch (IllegalArgumentException ignored) {
              }
            }
          }

          query.distinct(true);
          return cb.and(predicates.toArray(new Predicate[0]));
        };

    Page<AssetAssignment> pageResult =
        assetAssignmentRepository.findAll(
            specification,
            PageRequest.of(pageNumber, pageSize, Sort.by(direction, resolvedSortField)));

    return APIResponse.success(pageResult.map(this::toResponse));
  }

  @Override
  public APIResponse<AssetAssignmentResponse> getAssetAssignment(String id) {
    AssetAssignment aa = isExists(id);
    return APIResponse.success(toResponse(aa));
  }

  @Override
  public APIResponse<AssetAssignmentResponse> createAssetAssignment(
      AssetAssignmentCreateRequest request) {
    User user =
        userRepository
            .findById(request.getUserId())
            .orElseThrow(
                () -> new AssetManagementException(HttpStatus.NOT_FOUND.value(), "User not found"));

    Device device =
        deviceRepository
            .findById(request.getDeviceId())
            .orElseThrow(
                () ->
                    new AssetManagementException(HttpStatus.NOT_FOUND.value(), "Device not found"));

    AssetAssignment aa =
        AssetAssignment.builder()
            .user(user)
            .device(device)
            .build();

    aa.setStatus(AuditModifyUser.Status.ACTIVE);

    return APIResponse.success(toResponse(assetAssignmentRepository.save(aa)));
  }

  @Override
  public APIResponse<AssetAssignmentResponse> updateAssetAssignment(
      String id, AssetAssignmentUpdateRequest request) {
    AssetAssignment aa = isExists(id);

    User user =
        userRepository
            .findById(request.getUserId())
            .orElseThrow(
                () -> new AssetManagementException(HttpStatus.NOT_FOUND.value(), "User not found"));

    Device device =
        deviceRepository
            .findById(request.getDeviceId())
            .orElseThrow(
                () ->
                    new AssetManagementException(HttpStatus.NOT_FOUND.value(), "Device not found"));

    aa.setUser(user);
    aa.setDevice(device);
    aa.setReturnDate(request.getReturnDate());

    return APIResponse.success(toResponse(assetAssignmentRepository.saveAndFlush(aa)));
  }

  @Override
  public APIResponse<Void> deleteAssetAssignment(String id) {
    AssetAssignment aa = isExists(id);
    aa.setStatus(AuditModifyUser.Status.INACTIVE);
    assetAssignmentRepository.saveAndFlush(aa);
    return APIResponse.success(null);
  }

  @Override
  public APIResponse<AssetAssignmentResponse> returnDevice(String id, LocalDate returnDate) {
    AssetAssignment aa = isExists(id);

    // mark return date and assignment inactive
    aa.setReturnDate(returnDate);
    aa.setStatus(AuditModifyUser.Status.INACTIVE);
    assetAssignmentRepository.saveAndFlush(aa);

    // update device current status to AVAILABLE
    Device device = aa.getDevice();
    if (device != null) {
      device.setCurrentStatus(DeviceStatus.AVAILABLE);
      deviceRepository.saveAndFlush(device);
    }

    return APIResponse.success(toResponse(aa));
  }

  private AssetAssignmentResponse toResponse(AssetAssignment aa) {
    return AssetAssignmentResponse.builder()
        .id(aa.getId())
        .userId(aa.getUser() != null ? aa.getUser().getUserId() : null)
        .deviceId(aa.getDevice() != null ? aa.getDevice().getDeviceId() : null)
        .returnDate(aa.getReturnDate())
        .createdAt(aa.getCreatedDateTime())
        .updatedAt(aa.getModifiedDateTime())
        .build();
  }

  private AssetAssignment isExists(String id) {
    try {
      Long pk = Long.valueOf(id);
      return assetAssignmentRepository
          .findById(pk)
          .orElseThrow(
              () ->
                  new AssetManagementException(
                      HttpStatus.NOT_FOUND.value(), "AssetAssignment not found"));
    } catch (NumberFormatException ex) {
      throw new AssetManagementException(HttpStatus.BAD_REQUEST.value(), "Invalid id");
    }
  }
}
