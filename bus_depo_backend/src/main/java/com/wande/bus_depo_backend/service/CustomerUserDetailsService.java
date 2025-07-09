package com.wande.bus_depo_backend.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.wande.bus_depo_backend.model.UserModel;
import com.wande.bus_depo_backend.repo.UserRepo;

@Service
public class CustomerUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserModel userModel = userRepo.findByName(username).orElseThrow(() -> new UsernameNotFoundException(
                "User not found: " + username));
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_"+userModel.getRole());
        return new User(userModel.getName(),userModel.getPassword(),Collections.singleton(authority));
    }

}