package com.nimesh.assetmanagement.repository.device;

import com.nimesh.assetmanagement.entity.device.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {}
