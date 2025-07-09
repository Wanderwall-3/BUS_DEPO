package com.wande.bus_depo_backend.security;

import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private static final String SECRET_KEY_STRING = "dd68a05bdb7e5b339b0756bc43b80ffbaa56a9508634c95a0d22faa984faa";
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());

    public String generateToken(UserDetails UserDetails) {
        return Jwts.builder()
                .setSubject(UserDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token, UserDetails UserDetails) {
        try {
            String username = extractUsername(token);
            Date expiration = extractExpiration(token);
            return (username.equals(UserDetails.getUsername()) && expiration.after(new Date()));
        } catch (Exception e) {
            return false;
        }
    }

    private Date extractExpiration(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getPayload()
                .getExpiration();
    }

    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getPayload()
                .getSubject();
    }

    public String extractUsernameWithoutToken(HttpServletRequest request) {
        String auth = null;
        Cookie[] cookies = request.getCookies();
        System.out.println(cookies);
        if (cookies != null) {
            System.out.println(cookies);
            for (Cookie cookie : cookies) {
                // System.out.printf("Cookie  %s = %s%n", cookie.getName(), cookie.getValue());
                if ("JWT".equals(cookie.getName())) {
                    auth = cookie.getValue();
                    break;
                }
            }
        }

        String token = auth;
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getPayload()
                .getSubject();
    }
}
