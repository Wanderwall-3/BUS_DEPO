package com.wande.bus_depo_backend.model;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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

public class RouteModel {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_name",nullable = false)
    private String userName;
    @Column(columnDefinition = "json",nullable = false)
    private String  route;
    @Column(nullable = false)
    @JsonFormat(pattern = "hh:mm a")
    private LocalTime time;

    @ManyToOne
    @JoinColumn(name = "user_name",referencedColumnName = "user_name",insertable = false,updatable = false)
    @JsonManagedReference("driver-route") 
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private DriverModel driverModel;
}
