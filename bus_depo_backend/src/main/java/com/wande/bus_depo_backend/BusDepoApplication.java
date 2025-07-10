package com.wande.bus_depo_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EntityScan("com.wande.bus_depo_backend.model")
public class BusDepoApplication {

	public static void main(String[] args) {
		SpringApplication.run(BusDepoApplication.class, args);
	}

}
