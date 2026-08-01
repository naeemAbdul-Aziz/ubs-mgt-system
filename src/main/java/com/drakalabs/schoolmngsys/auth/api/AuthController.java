package com.drakalabs.schoolmngsys.auth.api;

import com.drakalabs.schoolmngsys.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication endpoints.
 *
 * <p>All endpoints here are public (no JWT required) — see {@code SecurityConfig}.
 * All other module endpoints require a valid JWT.
 *
 * @see <a href="docs/10-api-standards.md#5-resource-map">API Standards §5</a>
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login, token refresh, and logout")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Login with credentials to receive JWT token pair")
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse tokens = authService.login(request.username(), request.password(),
                request.clientIp());
        return ResponseEntity.ok(tokens);
    }

    @Operation(summary = "Refresh access token using a valid refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        TokenResponse tokens = authService.refresh(request.refreshToken());
        return ResponseEntity.ok(tokens);
    }

    @Operation(summary = "Logout — revokes the supplied refresh token")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest request) {
        authService.logout(request.refreshToken());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get current authenticated user info")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        return com.drakalabs.schoolmngsys.shared.security.SecurityUtils.getCurrentUser()
            .map(u -> {
                java.util.Set<String> permissions = u.authorities().stream()
                        .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                        .collect(java.util.stream.Collectors.toSet());
                return ResponseEntity.ok(new UserResponse(u.personId().toString(), u.username(), u.personType(), permissions));
            })
            .orElse(ResponseEntity.status(401).build());
    }

    // ─── Request / Response DTOs ──────────────────────────────────────────

    public record LoginRequest(
            @jakarta.validation.constraints.NotBlank String username,
            @jakarta.validation.constraints.NotBlank String password,
            String clientIp   // Optional; set by a request-IP-extraction filter
    ) {}

    public record RefreshRequest(
            @jakarta.validation.constraints.NotBlank String refreshToken
    ) {}

    public record TokenResponse(
            String accessToken,
            String refreshToken,
            long accessTokenExpiresInSeconds
    ) {}
    
    public record UserResponse(
            String personId,
            String username,
            String personType,
            java.util.Set<String> permissions
    ) {}
}
