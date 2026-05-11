package com.nimesh.assetmanagement.service.impl;

import com.nimesh.assetmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsService
    implements org.springframework.security.core.userdetails.UserDetailsService {
  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository
        .findByEmailAndIsActive(username, true)
        .orElseThrow(
            () ->
                new UsernameNotFoundException("Active User not found with username: " + username));
  }
}
