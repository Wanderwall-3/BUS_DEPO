package com.wande.bus_depo_backend.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

@Table(name = "user_model")
public class UserModel {
    @Id
    @Column(nullable = false, unique = true)
    private String name;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String role;

    @OneToMany(mappedBy = "userModel", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonManagedReference("user-admin")
    private List<AdminModel> admins;

    @OneToMany(mappedBy = "userModel", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonManagedReference("user‑students")
    private List<StudentModel> students;

    @OneToMany(mappedBy = "userModel", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonManagedReference("user-driver")
    private List<DriverModel> drivers;
}
