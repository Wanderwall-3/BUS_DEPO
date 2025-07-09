package com.wande.bus_depo_backend.repo;

import org.springframework.stereotype.Repository;

import com.wande.bus_depo_backend.model.DriverModel;

import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface DriverRepo extends JpaRepository<DriverModel,String>{
    boolean existsByUserName(String userName);
    DriverModel findByUserName(String userName);
}
