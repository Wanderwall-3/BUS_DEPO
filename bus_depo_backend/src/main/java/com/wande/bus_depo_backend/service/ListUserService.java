package com.wande.bus_depo_backend.service;

// import java.sql.DriverManager;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.wande.bus_depo_backend.model.AdminModel;
import com.wande.bus_depo_backend.model.DriverModel;
import com.wande.bus_depo_backend.model.StudentModel;
import com.wande.bus_depo_backend.repo.AdminRepo;
import com.wande.bus_depo_backend.repo.DriverRepo;
import com.wande.bus_depo_backend.repo.StudentRepo;

@Service
public class ListUserService {

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private DriverRepo driverRepo;

    @Autowired
    private AdminRepo adminRepo;

    public List<StudentModel> listAllStudent() {
        return studentRepo.findAll();
    }

    public List<DriverModel> listAllDriver() {
        return driverRepo.findAll();
    }

    public List<AdminModel> listAllAdmin() {
        return adminRepo.findAll();
    }
}
