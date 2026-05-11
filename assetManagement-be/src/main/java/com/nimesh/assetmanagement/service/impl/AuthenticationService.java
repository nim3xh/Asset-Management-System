package com.rental.x.service.impl;

import com.rental.x.dto.application.LoginRequest;
import com.rental.x.dto.application.RefreshTokenRequest;
import com.rental.x.dto.application.RegistrationRequest;
import com.rental.x.entity.application.PasswordResetToken;
import com.rental.x.entity.application.User;
import com.rental.x.exception.RentalException;
import com.rental.x.repository.application.PasswordResetTokenRepository;
import com.rental.x.repository.application.UserRepository;
import com.rental.x.response.APIResponse;
import com.rental.x.response.AuthResponse;
import com.rental.x.service.email.EmailService;
import com.rental.x.utility.JWTUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private  JWTUtils jwtUtils;
    @Autowired
    private  AuthenticationManager authenticationManager;

    @Value("${password.reset.link.expiry.minutes}")
    private int passwordResetLinkExpiryMinutes;

    @Value("${reset.link.domain}")
    private String resetLinkDomain;

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    private final EmailService emailService;


    public APIResponse<AuthResponse> register(RegistrationRequest request) {

        if(userRepository.existsByEmail(request.getEmail())){
            throw new RentalException("Email already exists");
        }

        User newUser = userRepository.save(buildUser(request));

        return APIResponse.success(AuthResponse.builder()
                .user(newUser)
                .message("user registration success")
                .build());
    }

    private User buildUser(RegistrationRequest request) {
        return User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .middleName(request.getMiddleName())
                .email(request.getEmail())
                .isActive(true)
                .nickName(request.getNickName())
                .userType(request.getUserType())
                .effectiveDate(LocalDateTime.now())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
    }

    public APIResponse<AuthResponse> login(LoginRequest request) throws RentalException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(),request.getPassword()));
        var user = userRepository.findByEmailAndIsActive(request.getEmail(), true).orElseThrow(
                () -> new RentalException("Active user not found given email")
        );
        var jwt = jwtUtils.generateToken(user, user.getUserId());
        var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user, user.getUserId());
        return APIResponse.success(AuthResponse.builder()
                        .token(jwt)
                        .refreshToken(refreshToken)
                        .expirationTime("24h")
                        .statusCode(200)
                        .message("login success")
                .build());
    }

    public APIResponse<AuthResponse> refresh(RefreshTokenRequest request) {
        String email = jwtUtils.extractUsername(request.getToken());
        User user =userRepository.findByEmailAndIsActive(email, true).orElseThrow(
                () -> new RentalException("Active user not found given token related email")
        );
        if (jwtUtils.isTokenValid(request.getToken(),user)){
            var jwt = jwtUtils.generateToken(user, user.getUserId());
            return APIResponse.success(AuthResponse.builder()
                    .token(jwt)
                    .token(jwtUtils.generateRefreshToken(new HashMap<>(), user, user.getUserId()))
                    .message("successfully Refreshed Token")
                    .expirationTime("24h")
                    .build());

        }
        return APIResponse.error("invalid token");
    }

    public APIResponse<String> forgotPasswordEmailSend(String email) {

        try {

            User user = userRepository.findByEmailAndIsActive(email, true).orElseThrow(
                    () -> new RentalException("Can't send email, active user not found given email")
            );

            String token = UUID.randomUUID().toString();
            String tokenHash = passwordEncoder.encode(token);

            PasswordResetToken tk =passwordResetTokenRepository.save(buildResetObject(tokenHash,  user.getUserId()));

            String resetLink =
                    resetLinkDomain + "/reset-password?id="
                            + tk.getId()
                            + "&token=" + token;

            //todo email send function
            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    user.getFirstName() + " " + user.getMiddleName() + " " + user.getMiddleName(),
                    resetLink
            );
            return APIResponse.success("Password reset link send Successfully");

        }catch (RentalException e){
            return APIResponse.error(e.getMessage());
        }

    }

    @Transactional
    public void resetPassword(Long tokenId, String rawToken, String newPassword){

        PasswordResetToken token =
                validateToken(tokenId, rawToken);

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        token.setUsed(true);
        passwordResetTokenRepository.save(token);
    }


    public PasswordResetToken validateToken(Long tokenId, String rawToken){
        PasswordResetToken token =
                passwordResetTokenRepository.findByIdAndUsedFalse(tokenId)
                        .orElseThrow(() ->
                                new RentalException("Invalid or expired token"));

        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RentalException("Token expired");
        }

        if (!passwordEncoder.matches(rawToken, token.getTokenHash())) {
            throw new RentalException("Invalid token");
        }

        return token;
    }

    private PasswordResetToken buildResetObject(String tokenHash, Long userId) {
        return PasswordResetToken.builder()
                .userId(userId)
                .tokenHash(tokenHash)
                .expiryTime(LocalDateTime.now().plusMinutes(passwordResetLinkExpiryMinutes))
                .used(false)
                .build();
    }
}
