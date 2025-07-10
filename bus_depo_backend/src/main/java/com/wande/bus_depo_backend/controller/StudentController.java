package com.wande.bus_depo_backend.controller;


import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.wande.bus_depo_backend.model.RouteModel;
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

    @GetMapping("/search")
    public List<RouteModel> getMethodName(HttpServletRequest request,@RequestParam String stop,@RequestParam LocalTime time) {
        return studentService.search(request, stop, time);
    }
}
