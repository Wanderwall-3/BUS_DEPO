package com.wande.bus_depo_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wande.bus_depo_backend.model.UserModel;
import com.wande.bus_depo_backend.repo.UserRepo;
import com.wande.bus_depo_backend.security.JwtUtil;
import com.wande.bus_depo_backend.service.AuthService;

import jakarta.servlet.http.Cookie;

import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CookieValue;
// import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepo userRepo;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody UserModel userModel, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userModel.getName(), userModel.getPassword()));
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            ResponseCookie cookie = ResponseCookie.from("JWT", token)
                    .httpOnly(true)
                    .secure(false)
                    .maxAge(30 * 24 * 60 * 60)
                    .path("/")
                    .sameSite("Strict")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
            return ResponseEntity.ok(Map.of("Message", "Login Successful"));
        }

        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("Error", "Invalid Credentials"));
        }
    }

    @PostMapping("/register")
    public String register(@RequestBody UserModel userModel) {
        userModel.setPassword(passwordEncoder.encode(userModel.getPassword()));
        return authService.register(userModel);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        /*
         * Build a delete‑cookie whose attributes are
         * IDENTICAL to the ones you used in /login
         * ─ except for Max‑Age = 0 and empty value.
         */

        ResponseCookie deleteCookie = ResponseCookie
                .from("JWT", "") // empty value
                .httpOnly(true)
                .secure(false) // ← MUST match login (login uses secure(false))
                .path("/") // ← MUST match login
                .sameSite("Strict") // ← MUST match login (login uses Strict)
                .maxAge(0) // 0 = delete immediately
                .build();

        response.setHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/tokenValidate")
    public ResponseEntity<?> tokenValidate(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.ok(false);
        }
    }

    @GetMapping("/getDetails")
    public ResponseEntity<?> getDetails(@CookieValue(value = "JWT", required = false) String token) {
        String name = jwtUtil.extractUsername(token);
        Optional<UserModel> userModel = userRepo.findByName(name);
        return ResponseEntity.ok(Map.of(
                // "id", userModel.get().getId(),
                "name", userModel.get().getName(),
                "email", userModel.get().getEmail(),
                "role", userModel.get().getRole()));
    }

}
