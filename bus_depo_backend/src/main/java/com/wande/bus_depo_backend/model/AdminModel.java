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
public class AdminModel {
    

    // @Id
    @Id
    @Column(name = "user_name")
    private String userName;
    
    
    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private Integer collegeRegisterNumber;

    @ManyToOne
    @JoinColumn(name = "user_name", referencedColumnName = "name", insertable = false, updatable = false)
    @JsonBackReference("user-admin")
    private UserModel userModel;
    
}
