package com.nimesh.assetmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "audit_log")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog extends AuditModifyUser {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "action", nullable = false)
  private String action;

  @Column(name = "entity_type", nullable = false)
  private String entityType;

  @Lob
  @Column(name = "old_value")
  private String oldValue;

  @Lob
  @Column(name = "new_value")
  private String newValue;
}
