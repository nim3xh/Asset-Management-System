package com.nimesh.assetmanagement.config;

import com.nimesh.assetmanagement.service.impl.UserDetailsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String API_PREFIX = "/api/";
    private static final String ADMIN_ROLE = "ADMIN";
    private static final String IT_MANAGER_ROLE = "IT_MANAGER";
    private static final String IT_STAFF_ROLE = "IT_STAFF";
    private static final String[] ADMIN_AUTHORITIES = {ADMIN_ROLE};
    private static final String[] ADMIN_IT_MANAGER_AUTHORITIES = {ADMIN_ROLE, IT_MANAGER_ROLE};
    private static final String[] MANAGEMENT_AUTHORITIES = {ADMIN_ROLE, IT_MANAGER_ROLE, IT_STAFF_ROLE};

    private final UserDetailsService ourUserDetailsService;
    private final JWTAuthFilter jwtAuthFilter;
    private final String version;

    public SecurityConfig(
            UserDetailsService ourUserDetailsService,
            JWTAuthFilter jwtAuthFilter,
            @Value("${version}") String version
    ) {
        this.ourUserDetailsService = ourUserDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
        this.version = version;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(request -> request
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(API_PREFIX + version + "/auth/**").permitAll()
                        .requestMatchers(API_PREFIX + version + "/public/**").permitAll()
                        .requestMatchers("/css/**", "/image/**").permitAll()
                        .requestMatchers(API_PREFIX + version + "/user-management/**").hasAnyAuthority(ADMIN_ROLE)
                        .requestMatchers(API_PREFIX + version + "/device/**").hasAnyAuthority(ADMIN_ROLE, IT_MANAGER_ROLE)
                        .requestMatchers(API_PREFIX + version + "/brand/**").hasAnyAuthority(ADMIN_ROLE, IT_MANAGER_ROLE)
                        .requestMatchers(API_PREFIX + version + "/assign/**").hasAnyAuthority(ADMIN_ROLE, IT_MANAGER_ROLE, IT_STAFF_ROLE)
                        .anyRequest().authenticated())
                .sessionManagement(manager -> manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(ourUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
