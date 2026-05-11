package com.nimesh.assetmanagement.controller.device;

import com.nimesh.assetmanagement.dto.device.BrandCreateRequest;
import com.nimesh.assetmanagement.dto.device.BrandResponse;
import com.nimesh.assetmanagement.dto.device.BrandUpdateRequest;
import com.nimesh.assetmanagement.response.APIResponse;
import com.nimesh.assetmanagement.service.device.BrandService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/${version}/brand")
public class BrandController {

  private final BrandService brandService;

  @PostMapping(value = "/create")
  public ResponseEntity<APIResponse<BrandResponse>> create(
      @RequestBody @Valid final BrandCreateRequest request) {

    APIResponse<BrandResponse> response = brandService.createBrand(request);

    return ResponseEntity.ok(response);
  }

  @GetMapping(value = "/get/{id}")
  public ResponseEntity<APIResponse<BrandResponse>> getById(@PathVariable final String id) {

    APIResponse<BrandResponse> response = brandService.getBrand(id);

    return ResponseEntity.ok(response);
  }

  @PutMapping(value = "/update/{id}")
  public ResponseEntity<APIResponse<BrandResponse>> update(
      @PathVariable final String id, @RequestBody @Valid final BrandUpdateRequest request) {

    APIResponse<BrandResponse> response = brandService.updateBrand(id, request);

    return ResponseEntity.ok(response);
  }

  @PutMapping(value = "/delete/{id}")
  public ResponseEntity<APIResponse<Void>> delete(@PathVariable final String id) {

    APIResponse<Void> response = brandService.deleteBrand(id);

    return ResponseEntity.ok(response);
  }

  @GetMapping(value = "/get/all")
  public ResponseEntity<APIResponse<Page<BrandResponse>>> getAll(
      @RequestParam(defaultValue = "0") final Integer page,
      @RequestParam(defaultValue = "10") final Integer size,
      @RequestParam(defaultValue = "brandId") final String sortField,
      @RequestParam(defaultValue = "desc") final String sortDirection,
      @RequestParam Map<String, String> allParams) {

    allParams.remove("sortField");
    allParams.remove("page");
    allParams.remove("size");
    allParams.remove("sortDirection");

    APIResponse<Page<BrandResponse>> response =
        brandService.getBrands(allParams, page, size, sortField, sortDirection);

    return ResponseEntity.ok(response);
  }
}
