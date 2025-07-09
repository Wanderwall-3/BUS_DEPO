package com.wande.bus_depo_backend.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wande.bus_depo_backend.model.UserModel;

import jakarta.persistence.LockModeType;


@Repository
public interface UserRepo extends JpaRepository<UserModel, String> {

    // boolean existsByUserName(String userName);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM UserModel s WHERE s.name = :name")
    Optional<UserModel> findByNameForWrite(@Param("name") String name);

    Optional<UserModel> findByName(String name);

    void deleteByName(String name);
	
}
