package com.nimesh.assetmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AuditModifyUser extends AuditCreateUser {

  @LastModifiedBy @Column private String modifiedUser;

  @LastModifiedDate @Column private LocalDateTime modifiedDateTime;

  @CreatedDate
  @Column(updatable = false, nullable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate @Column private LocalDateTime updatedAt;

  @Enumerated(EnumType.STRING)
  private Status status;

  public enum Status {
    ACTIVE,
    INACTIVE
  }
}
