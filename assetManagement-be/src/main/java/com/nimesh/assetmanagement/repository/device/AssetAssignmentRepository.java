package com.nimesh.assetmanagement.repository.device;

import com.nimesh.assetmanagement.entity.device.AssetAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetAssignmentRepository extends JpaRepository<AssetAssignment, Long>, JpaSpecificationExecutor<AssetAssignment> {}
