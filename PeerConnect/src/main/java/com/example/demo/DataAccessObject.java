package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DataAccessObject {
    @Autowired
    private UserInterface userRepository;

    // Insert new user into the database
    public void insert(Users user) {
        userRepository.save(user);
    }

    public Users findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
