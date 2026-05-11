package com.nimesh.assetmanagement.entity.device;

import com.nimesh.assetmanagement.entity.AuditModifyUser;
import com.nimesh.assetmanagement.entity.User;
import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "asset_assignment")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetAssignment extends AuditModifyUser {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", referencedColumnName = "user_id")
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "device_id", referencedColumnName = "device_id")
  private Device device;

  @Column(name = "return_date")
  private LocalDate returnDate;
}
