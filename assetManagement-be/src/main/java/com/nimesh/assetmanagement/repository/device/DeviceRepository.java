package com.nimesh.assetmanagement.repository.device;

import com.nimesh.assetmanagement.entity.device.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {}
