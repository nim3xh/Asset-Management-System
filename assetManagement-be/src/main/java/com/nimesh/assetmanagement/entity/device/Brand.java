package com.nimesh.assetmanagement.entity.device;

import com.nimesh.assetmanagement.entity.AuditModifyUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "brand")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Brand extends AuditModifyUser {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "brand_id")
  private Long brandId;

  @Column(name = "name")
  private String name;
}
