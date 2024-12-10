package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInterface extends JpaRepository<Users, Long>
{
	public Users findByUsername(String username);
}
