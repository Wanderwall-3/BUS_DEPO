package com.wande.bus_depo_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wande.bus_depo_backend.model.AdminModel;
import com.wande.bus_depo_backend.model.DriverModel;
import com.wande.bus_depo_backend.model.StudentModel;
import com.wande.bus_depo_backend.service.AuthService;
import com.wande.bus_depo_backend.service.RegisterUserService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/register")
public class RegisterUserController {

    @Autowired
    private RegisterUserService registerUserService;

    @Autowired
    private AuthService authService;

    @PostMapping("/student")
    public ResponseEntity<?> studentRegister(@RequestBody StudentModel studentModel,HttpServletRequest request) {
        return ResponseEntity.ok(registerUserService.registerStudent(studentModel,request));
    }

    @PostMapping("/admin")
    public ResponseEntity<?> adminRegister(@RequestBody AdminModel adminModel,HttpServletRequest request) {
        return registerUserService.registerAdmin(adminModel,request);
    }
    
    @PostMapping("/driver")
    public ResponseEntity<?> driverRegister(@RequestBody DriverModel driverModel, HttpServletRequest request) {
        return registerUserService.registerDriver(driverModel, request);
    }

    @DeleteMapping("/delete/{name}")
    public ResponseEntity<?> delete(@PathVariable("name") String name) {
        return authService.deleteAccount(name);
    }
    
}
