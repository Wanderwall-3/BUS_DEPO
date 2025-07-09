package com.wande.bus_depo_backend.service;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.wande.bus_depo_backend.model.StudentModel;
import com.wande.bus_depo_backend.repo.StudentRepo;
import com.wande.bus_depo_backend.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class StudentService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private SupabaseStorageService supabaseStorageService;

    public ResponseEntity<?> uploadProfile(HttpServletRequest request, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file received");
        }

        String studentName = jwtUtil.extractUsernameWithoutToken(request);
        StudentModel student = studentRepo.findByUserName(studentName);
        if (student == null) {
            return ResponseEntity.status(404).body("Student not found");
        }

        try {
            String key = UUID.randomUUID() + "-" + StringUtils.cleanPath(file.getOriginalFilename());
            String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
            String url = supabaseStorageService.uploadFile(key, file.getBytes(), contentType);

            student.setProfile(url);
            studentRepo.save(student);

            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error reading file");
        }
    }

    public StudentModel getDetails(HttpServletRequest request) {
        String studentName = jwtUtil.extractUsernameWithoutToken(request);
        return studentRepo.findByUserName(studentName);
    }
}
