package com.wande.bus_depo_backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wande.bus_depo_backend.model.StudentModel;

@Repository
public interface StudentRepo extends JpaRepository<StudentModel,String>{
    boolean existsByUserName(String username);

    StudentModel findByUserName(String studentName);
}