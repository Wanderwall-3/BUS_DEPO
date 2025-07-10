package com.wande.bus_depo_backend.model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;

@JsonIgnoreProperties(value = { "routeModel" })
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DriverModel {
    @Id
    @Column(name = "user_name")
    private String userName;

    @Column(nullable = true)
    private String profile;

    @ManyToOne
    @JoinColumn(name = "user_name", referencedColumnName = "name", insertable = false, updatable = false)
    @JsonBackReference("user-driver")
    private UserModel userModel;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(unique = true, nullable = false)
    private String busId;
    @Column(nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate joinDate;

    @Column(nullable = false)
    private String department;
    @Column(nullable = false)
    private String phoneNumber;
    @Column(nullable = false)
    private Integer collegeRegisterNumber;
    // @Column(columnDefinition = "json",nullable = true)
    // private String route;

    @OneToMany(mappedBy = "driverModel", cascade = CascadeType.REMOVE, orphanRemoval = true)
    // @JsonBackReference("driver-route") 
    private List<RouteModel> routeModel;

}
