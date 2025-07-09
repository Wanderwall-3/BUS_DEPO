package com.wande.bus_depo_backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.wande.bus_depo_backend.model.AdminModel;

public interface AdminRepo extends JpaRepository<AdminModel,String>{

    boolean existsByUserName(String userName);
}
