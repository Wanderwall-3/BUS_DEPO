package com.wande.bus_depo_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentModel {
    @Id
    @Column(name = "user_name")
    private String userName;

    @ManyToOne
    @JoinColumn(name = "user_name", referencedColumnName = "name", insertable = false, updatable = false)
    @JsonBackReference("user‑students")
    private UserModel userModel;

    @Column(nullable = true)
    private String profile;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private Integer passoutYear;

    @Column(nullable = false)
    private Integer collegeRegisterNumber;
}
