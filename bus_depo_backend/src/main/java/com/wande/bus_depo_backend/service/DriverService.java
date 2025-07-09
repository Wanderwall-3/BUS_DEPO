package com.wande.bus_depo_backend.service;

import com.wande.bus_depo_backend.repo.RouteRepo;
import com.wande.bus_depo_backend.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.wande.bus_depo_backend.model.DriverModel;
import com.wande.bus_depo_backend.model.RouteModel;
import com.wande.bus_depo_backend.repo.DriverRepo;

@Service
public class DriverService {

    @Autowired
    private DriverRepo driverRepo;

    @Autowired
    private RouteRepo routeRepo;

    @Autowired
    private JwtUtil jwtUtil;

    public ResponseEntity<?> addRoute(HttpServletRequest request, RouteModel routeModel) {
        String name = jwtUtil.extractUsernameWithoutToken(request);
        DriverModel driver = driverRepo.findByUserName(name);
        // driver.setRoute(route);
        routeModel.setUserName(name);
        routeModel.setDriverModel(driver);
        routeRepo.save(routeModel);
        return ResponseEntity.ok("Route updated");
    }

    public ResponseEntity<List<RouteModel>> getRoute(HttpServletRequest request) {
        String name = jwtUtil.extractUsernameWithoutToken(request);
        List<RouteModel> routeModels = routeRepo.findByUserName(name);
        return ResponseEntity.ok(routeModels);
    }

    public ResponseEntity<?> deleteRoute(HttpServletRequest request, Long id) {
        String name = jwtUtil.extractUsernameWithoutToken(request);
        try {
            routeRepo.deleteByIdAndUserName(id, name);
            return ResponseEntity.ok("Route deleted successfully.");
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Route not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }

    @Transactional
    public ResponseEntity<?> modifyRoute(Long id, RouteModel routeModel){
        Optional<RouteModel> routeModelExisting = routeRepo.findById(id);
        routeModelExisting.get().setRoute(routeModel.getRoute());
        routeModelExisting.get().setTime(routeModel.getTime());
        routeRepo.save(routeModelExisting.get());
        return ResponseEntity.ok("Route Updated Successfully");
    }

    // public ResponseEntity<?> getRoute(String name){
    // DriverModel driver = driverRepo.findByUserName(name);
    // return ResponseEntity.ok(driver.getRoute());
    // }
}
