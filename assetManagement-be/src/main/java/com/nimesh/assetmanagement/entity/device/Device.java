package com.nimesh.assetmanagement.entity.device;

import com.nimesh.assetmanagement.entity.AuditModifyUser;
import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "device")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Device extends AuditModifyUser {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "device_id")
  private Long deviceId;

  @Column(name = "serial_number")
  private String serialNumber;

  @Column(name = "asset_tag")
  private String assetTag;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "brand_id", referencedColumnName = "brand_id")
  private Brand brandId;

  @Column(name = "model")
  private String model;

  @Column(name = "purchase_cost")
  private BigDecimal purchaseCost;

  @Enumerated(EnumType.STRING)
  @Column(name = "current_status")
  private AuditModifyUser.Status currentStatus;
}
