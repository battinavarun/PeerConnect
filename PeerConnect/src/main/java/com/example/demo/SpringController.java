package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class SpringController 
{
	private final DataAccessObject dao;

    @Autowired
    public SpringController(DataAccessObject dao) {
        this.dao = dao;
    }

    // User registration logic remains the same
    @PostMapping("/user")
    public ResponseEntity<String> createUser(@RequestBody Users user) {
        try {
            System.out.println("Username: " + user.getUsername());
            dao.insert(user); // Save the user to the database
            return ResponseEntity.status(HttpStatus.CREATED)
                                 .body("User created successfully: " + user.getUsername());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error occurred while creating user: " + e.getMessage());
        }
    }

    // New login logic
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Users loginRequest) {
        try {
            // Find the user by username
            Users user = dao.findUserByUsername(loginRequest.getUsername());

            // Check if the user exists and the password matches
            if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.status(HttpStatus.OK).body("Login successful");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error occurred during login: " + e.getMessage());
        }
    }

}
