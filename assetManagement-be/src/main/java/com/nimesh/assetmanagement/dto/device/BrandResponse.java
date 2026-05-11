package com.nimesh.assetmanagement.dto.device;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrandResponse {
  private Long brandId;
  private String name;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
