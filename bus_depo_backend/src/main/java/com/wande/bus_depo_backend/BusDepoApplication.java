package com.wande.bus_depo_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.wande.bus_depo_backend.model")
@EnableJpaRepositories("com.wande.bus_depo_backend.repo")
public class BusDepoApplication {

	public static void main(String[] args) {
		SpringApplication.run(BusDepoApplication.class, args);
	}

}
