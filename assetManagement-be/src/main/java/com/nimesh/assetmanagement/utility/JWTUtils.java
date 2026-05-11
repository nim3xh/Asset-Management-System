package com.nimesh.assetmanagement.utility;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JWTUtils {

  private SecretKey key;
  private static final long EXPIRATION_TIME = 86400000L; // 24 hours
  private static final long REFRESH_EXPIRATION_TIME = 604800000L; // 7 days

  // It's better to inject the secret from application.properties
  @Value("${jwt.secret:defaultSecretKeyThatShouldBeAtLeast32CharactersLongForHS256Algorithm}")
  private String secretString;

  public JWTUtils() {
    // Initialize with a default secret - this will be overridden by @Value injection
    initializeKey("defaultSecretKeyThatShouldBeAtLeast32CharactersLongForHS256Algorithm");
  }

  // Alternative constructor for testing or manual initialization
  public JWTUtils(String secret) {
    initializeKey(secret);
  }

  private void initializeKey(String secret) {
    // For HMAC-SHA256, we need the secret as bytes, not base64 decoded
    byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
    this.key = new SecretKeySpec(keyBytes, "HmacSHA256");
  }

  // Initialize key after @Value injection
  @jakarta.annotation.PostConstruct
  public void init() {
    if (secretString != null && !secretString.isEmpty()) {
      initializeKey(secretString);
    }
  }

  public String generateToken(UserDetails userDetails, Long userId) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("userName", userDetails.getUsername());
    claims.put("userId", userId);
    return Jwts.builder()
        .subject(userDetails.getUsername())
        .claims(claims)
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
        .signWith(key)
        .compact();
  }

  public String generateRefreshToken(
      Map<String, Object> claims, UserDetails userDetails, Long userId) {
    claims.put("userName", userDetails.getUsername());
    claims.put("userId", userId);
    return Jwts.builder()
        .claims(claims)
        .subject(userDetails.getUsername())
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(
            new Date(
                System.currentTimeMillis()
                    + REFRESH_EXPIRATION_TIME)) // Longer expiration for refresh token
        .signWith(key)
        .compact();
  }

  public String extractUsername(String token) {
    return extractClaims(token, Claims::getSubject);
  }

  public Date extractExpiration(String token) {
    return extractClaims(token, Claims::getExpiration);
  }

  private <T> T extractClaims(String token, Function<Claims, T> claimsFunction) {
    return claimsFunction.apply(
        Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload());
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }

  public boolean isTokenExpired(String token) {
    return extractClaims(token, Claims::getExpiration).before(new Date());
  }
}
