package com.wande.bus_depo_backend.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.wande.bus_depo_backend.model.StudentModel;
import com.wande.bus_depo_backend.service.StudentService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@PreAuthorize("hasRole('STUDENT')")
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PutMapping("/upload/profile")
    public ResponseEntity<?> uploadProfile(HttpServletRequest request,
            @RequestParam("file") MultipartFile file) throws Exception {
        return studentService.uploadProfile(request, file);
    }

    @GetMapping("/getDetails")
    public StudentModel getDetails(HttpServletRequest request) {
        return studentService.getDetails(request);
    }
    

}
