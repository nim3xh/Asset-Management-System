package com.nimesh.assetmanagement.service.device;

import com.nimesh.assetmanagement.dto.device.BrandCreateRequest;
import com.nimesh.assetmanagement.dto.device.BrandResponse;
import com.nimesh.assetmanagement.dto.device.BrandUpdateRequest;
import com.nimesh.assetmanagement.response.APIResponse;
import java.util.Map;
import org.springframework.data.domain.Page;

public interface BrandService {
  APIResponse<Page<BrandResponse>> getBrands(
      Map<String, String> filters,
      Integer page,
      Integer size,
      String sortField,
      String sortDirection);

  APIResponse<BrandResponse> getBrand(String brandId);

  APIResponse<BrandResponse> createBrand(BrandCreateRequest brandRequest);

  APIResponse<BrandResponse> updateBrand(String brandId, BrandUpdateRequest brandRequest);

  APIResponse<Void> deleteBrand(String brandId);
}
