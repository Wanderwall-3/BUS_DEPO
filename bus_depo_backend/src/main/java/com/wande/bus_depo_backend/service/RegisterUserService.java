package com.wande.bus_depo_backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wande.bus_depo_backend.model.AdminModel;
import com.wande.bus_depo_backend.model.DriverModel;
import com.wande.bus_depo_backend.model.StudentModel;
import com.wande.bus_depo_backend.model.UserModel;
import com.wande.bus_depo_backend.repo.AdminRepo;
import com.wande.bus_depo_backend.repo.DriverRepo;
import com.wande.bus_depo_backend.repo.StudentRepo;
import com.wande.bus_depo_backend.repo.UserRepo;
import com.wande.bus_depo_backend.security.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class RegisterUserService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private DriverRepo driverRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String extractUsernameFromCookieString(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String token = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT".equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token != null) {
            return jwtUtil.extractUsername(token);
        } else {
            throw new RuntimeException("JWT token not found in cookies");
        }

    }

    // public void registerStudent(StudentModel studentModel) {
    //     studentRepo.save(studentModel);
    // }

    @Transactional
    public ResponseEntity<?> registerAdmin(AdminModel adminModel, HttpServletRequest request) {

        // userRepo.save(userModel);

        // // Simulate failure
        // if (true) {
        //     throw new RuntimeException("Simulated failure after saving user");
        // }

        // adminRepo.save(adminModel);

        String username = extractUsernameFromCookieString(request);
        System.out.println("Requesting admin: " + username);

        if (!adminRepo.existsByUserName(username)) {
            return ResponseEntity.status(403).body("Illegal access: Only admins can register new admins");
        }

        Optional<UserModel> user = userRepo.findByNameForWrite(adminModel.getUserName());
        if (user.isPresent()) {
            return ResponseEntity.status(409).body("Username already exists");
        }

        if (adminRepo.existsByUserName(adminModel.getUserName())) {
            return ResponseEntity.status(409).body("Admin already registered with ID: " + adminModel.getUserName());
        }

        UserModel userModel = new UserModel();
        userModel.setName(adminModel.getUserName());
        userModel.setPassword(passwordEncoder.encode("password1"));
        userModel.setRole("ADMIN");
        userModel.setEmail(adminModel.getEmail());
        userRepo.save(userModel);
        adminModel.setUserModel(userModel);
        adminRepo.save(adminModel);
        return ResponseEntity.ok("Admin registered successfully");
    }

    @Transactional
    public ResponseEntity<?> registerDriver(DriverModel driverModel,HttpServletRequest request) {
        String username = extractUsernameFromCookieString(request);
        System.out.println("Requesting admin: " + username);

        if (!adminRepo.existsByUserName(username)) {
            return ResponseEntity.status(403).body("Illegal access: Only admins can register new admins");
        }

        Optional<UserModel> user = userRepo.findByNameForWrite(driverModel.getUserName());
        if (user.isPresent()) {
            return ResponseEntity.status(409).body("Username already exists");
        }

        if (driverRepo.existsByUserName(driverModel.getUserName())) {
            return ResponseEntity.status(409).body("Driver already registered with ID: " + driverModel.getUserName());
        }
        UserModel userModel = new UserModel();
        userModel.setName(driverModel.getUserName());
        userModel.setPassword(passwordEncoder.encode("password1"));
        userModel.setRole("DRIVER");
        userModel.setEmail(driverModel.getEmail());
        userRepo.save(userModel);
        driverModel.setUserModel(userModel);
        driverRepo.save(driverModel);
        return ResponseEntity.ok("Driver registered successfully");
        
    }

    @Transactional
    public ResponseEntity<?> registerStudent(StudentModel studentModel,HttpServletRequest request) {
        String username = extractUsernameFromCookieString(request);
        System.out.println("Requesting admin: " + username);

        if (!adminRepo.existsByUserName(username)) {
            return ResponseEntity.status(403).body("Illegal access: Only admins can register new admins");
        }

        Optional<UserModel> user = userRepo.findByNameForWrite(studentModel.getUserName());
        if (user.isPresent()) {
            return ResponseEntity.status(409).body("Username already exists");
        }

        if (studentRepo.existsByUserName(studentModel.getUserName())) {
            return ResponseEntity.status(409).body("Student already registered with ID: " + studentModel.getUserName());
        }
        UserModel userModel = new UserModel();
        userModel.setName(studentModel.getUserName());
        userModel.setPassword(passwordEncoder.encode("password1"));
        userModel.setRole("STUDENT");
        userModel.setEmail(studentModel.getEmail());
        userRepo.save(userModel);
        studentModel.setUserModel(userModel);
        studentRepo.save(studentModel);
        return ResponseEntity.ok("Student registered successfully");

    }

}
