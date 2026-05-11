package com.nimesh.assetmanagement.service.impl.device;

import com.nimesh.assetmanagement.dto.device.BrandCreateRequest;
import com.nimesh.assetmanagement.dto.device.BrandResponse;
import com.nimesh.assetmanagement.dto.device.BrandUpdateRequest;
import com.nimesh.assetmanagement.entity.AuditModifyUser;
import com.nimesh.assetmanagement.entity.device.Brand;
import com.nimesh.assetmanagement.exception.AssetManagementException;
import com.nimesh.assetmanagement.repository.device.BrandRepository;
import com.nimesh.assetmanagement.response.APIResponse;
import com.nimesh.assetmanagement.service.device.BrandService;
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
public class BrandServiceImpl implements BrandService {

  private final BrandRepository brandRepository;

  @Override
  public APIResponse<Page<BrandResponse>> getBrands(
      Map<String, String> filters,
      Integer page,
      Integer size,
      String sortField,
      String sortDirection) {
    int pageNumber = page != null && page >= 0 ? page : 0;
    int pageSize = size != null && size > 0 ? size : 20;
    String resolvedSortField = (sortField == null || sortField.isBlank()) ? "brandId" : sortField;
    Sort.Direction direction =
        "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;

    Specification<Brand> specification = (root, query, cb) -> {
      jakarta.persistence.criteria.Predicate predicate = cb.conjunction();
      
      if (filters != null) {
        if (filters.containsKey("name") && filters.get("name") != null && !filters.get("name").isBlank()) {
          predicate = cb.and(predicate, cb.like(cb.lower(root.get("name")), "%" + filters.get("name").toLowerCase() + "%"));
        }
        
        if (filters.containsKey("status") && filters.get("status") != null && !filters.get("status").isBlank()) {
          try {
            predicate = cb.and(predicate, cb.equal(root.get("status"), com.nimesh.assetmanagement.entity.AuditModifyUser.Status.valueOf(filters.get("status").toUpperCase())));
          } catch (IllegalArgumentException ignored) {}
        }
      }
      return predicate;
    };
    Page<Brand> pageResult =
        brandRepository.findAll(specification, PageRequest.of(pageNumber, pageSize, Sort.by(direction, resolvedSortField)));

    return APIResponse.success(pageResult.map(this::toResponse));
  }

  @Override
  public APIResponse<BrandResponse> getBrand(String brandId) {
    Brand brand = isBrandExists(brandId);
    return APIResponse.success(toResponse(brand));
  }

  @Override
  public APIResponse<BrandResponse> createBrand(BrandCreateRequest brandRequest) {
    Brand brand = Brand.builder().name(brandRequest.getName()).build();
    brand.setStatus(AuditModifyUser.Status.ACTIVE);
    return APIResponse.success(toResponse(brandRepository.save(brand)));
  }

  @Override
  public APIResponse<BrandResponse> updateBrand(String brandId, BrandUpdateRequest brandRequest) {
    Brand brand = isBrandExists(brandId);
    brand.setName(brandRequest.getName());
    return APIResponse.success(toResponse(brandRepository.saveAndFlush(brand)));
  }

  @Override
  public APIResponse<Void> deleteBrand(String brandId) {
    Brand brand = isBrandExists(brandId);
    brand.setStatus(AuditModifyUser.Status.INACTIVE);
    brandRepository.saveAndFlush(brand);
    return APIResponse.success(null);
  }

  private BrandResponse toResponse(Brand brand) {
    return BrandResponse.builder()
        .brandId(brand.getBrandId())
        .name(brand.getName())
        .status(brand.getStatus() != null ? brand.getStatus().name() : null)
        .createdAt(brand.getCreatedDateTime())
        .updatedAt(brand.getModifiedDateTime())
        .build();
  }

  private Brand isBrandExists(String brandId) {
    try {
      Long id = Long.valueOf(brandId);
      return brandRepository
          .findById(id)
          .orElseThrow(() -> new AssetManagementException(HttpStatus.NOT_FOUND.value(), "Brand not found"));
    } catch (NumberFormatException ex) {
      throw new AssetManagementException(HttpStatus.BAD_REQUEST.value(), "Invalid brand id");
    }
  }
}
