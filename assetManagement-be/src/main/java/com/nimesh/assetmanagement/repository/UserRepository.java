package com.nimesh.assetmanagement.repository;

import com.nimesh.assetmanagement.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmailAndIsActive(String email, Boolean isActive);

  boolean existsByEmailAndIsActive(String email, Boolean isActive);
}
