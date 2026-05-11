package com.nimesh.assetmanagement.dto.device;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetAssignmentUpdateRequest {
  private Long userId;
  private Long deviceId;
  private LocalDate returnDate;
}

