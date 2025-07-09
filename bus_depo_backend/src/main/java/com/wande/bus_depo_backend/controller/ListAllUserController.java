package com.wande.bus_depo_backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wande.bus_depo_backend.service.ListUserService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/list")
public class ListAllUserController {
    @Autowired
    private ListUserService listUserService;

    @GetMapping("/{role}")
    public ResponseEntity<List<?>> getAllByRole(@PathVariable String role) {

        List<?> list;

        switch (role.toUpperCase()) {
            case "STUDENT" -> list = listUserService.listAllStudent();
            case "DRIVER" -> list = listUserService.listAllDriver();
            case "ADMIN" -> list = listUserService.listAllAdmin();
            default -> {
                return ResponseEntity.badRequest()
                        .body(List.of()); // or .build()
            }
        }
        return ResponseEntity.ok(list); // ✅ exactly one ResponseEntity
    }

}
