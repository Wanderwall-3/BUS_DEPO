package com.wande.bus_depo_backend.repo;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.wande.bus_depo_backend.model.RouteModel;

import jakarta.transaction.Transactional;

@Repository
public interface RouteRepo extends JpaRepository<RouteModel, Long> {

    Optional<RouteModel> findById(Long id);

    List<RouteModel> findByUserName(String name);

    @Transactional
    @Modifying
    @Query("DELETE FROM RouteModel r WHERE r.id = :id AND r.userName = :user")
    void deleteByIdAndUserName(@Param("id") Long id, @Param("user") String user);

    @Query("""
               SELECT r
               FROM RouteModel r
               JOIN FETCH r.driverModel
               WHERE LOWER(r.route) LIKE LOWER(CONCAT('%', :stop, '%'))
                 AND r.time >= :time
            """)
    List<RouteModel> findByRouteKeyword(@Param("stop") String stop,
            @Param("time") LocalTime time);
    

}
