package com.wande.bus_depo_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wande.bus_depo_backend.model.UserModel;
import com.wande.bus_depo_backend.repo.UserRepo;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AuthService {
    @Autowired
    private UserRepo userRepo;

    public String register(UserModel userModel) {
        userRepo.save(userModel);
        return "Register Successfully";
    }

    @Transactional // 🔑 makes sure the whole delete happens atomically
    public ResponseEntity<?> deleteAccount(String name) {

        UserModel user = userRepo.findById(name)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + name));

        userRepo.delete(user); // ➜ **entity** delete → cascades run ✅
        return ResponseEntity.noContent().build(); // 204 is idiomatic for DELETE
    }

}
