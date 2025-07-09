package com.wande.bus_depo_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.wande.bus_depo_backend.model.DriverModel;
import com.wande.bus_depo_backend.model.RouteModel;
import com.wande.bus_depo_backend.repo.DriverRepo;
import com.wande.bus_depo_backend.security.JwtUtil;
import com.wande.bus_depo_backend.service.DriverService;
import com.wande.bus_depo_backend.service.SupabaseStorageService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;

@RestController
@PreAuthorize("hasRole('DRIVER')")
@RequestMapping("/driver")
public class DriverController {
    @Autowired
    private DriverService driverService;

    @Autowired
    private SupabaseStorageService supabaseStorageService;

    @Autowired
    private DriverRepo driverRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @PutMapping("/upload/profile/{name}")
    public ResponseEntity<?> uploadProfile(HttpServletRequest request, @PathVariable String name,
            @RequestParam("file") MultipartFile file) throws Exception {
        String driverName = jwtUtil.extractUsernameWithoutToken(request);
        DriverModel driver = driverRepo.findByUserName(name);
        if (!driverName.equals(driver.getUserName())) {
            return ResponseEntity.badRequest().body(Map.of("Access", "Denied"));
        }
        String url = supabaseStorageService.uploadFile(file.getOriginalFilename(), file.getBytes(),
                file.getContentType());
        driver.setProfile(url);
        driverRepo.save(driver);
        return ResponseEntity.ok("Successfully uploaded");
    }

    @GetMapping("/details")
    public ResponseEntity<DriverModel> driverDetails(HttpServletRequest request) {
        String driverName = jwtUtil.extractUsernameWithoutToken(request);
        return ResponseEntity.ok(driverRepo.findByUserName(driverName));
    }

    @PostMapping("/route")
    public ResponseEntity<?> addRoute(HttpServletRequest request,
            @RequestBody RouteModel routeModel) {
        driverService.addRoute(request,routeModel);
        return ResponseEntity.ok("Successfully uploaded");
    }

    @GetMapping("/route")
    public ResponseEntity<List<RouteModel>> getRoute(HttpServletRequest request) {
        return driverService.getRoute(request);
    }

    @PutMapping("/route/{id}")
    public ResponseEntity<?> modifyRoute(@PathVariable Long id, @RequestBody RouteModel routeModel) {
        return driverService.modifyRoute(id, routeModel);
    }

    @DeleteMapping("/route/{id}")
    public ResponseEntity<?> deleteRoute(HttpServletRequest request,@PathVariable Long id){
        return driverService.deleteRoute(request, id);
    }

}
