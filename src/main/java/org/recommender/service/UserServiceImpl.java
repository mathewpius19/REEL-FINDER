package org.recommender.service;

import jakarta.transaction.Transactional;
import org.recommender.repository.UserRepository;
import org.recommender.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public User signup(String email, String password, String userName, String genrePref) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        // If a user with this email exists, stop and inform the caller
        if (existingUser != null && existingUser.isPresent()) {
            throw new RuntimeException("email or user already exists");
        }

        User user = new User();
        user.setEmail(email)
                .setPassword(encoder.encode(password))
                .setUserName(userName)
                .setGenrePref(genrePref);

        return userRepository.save(user);
    }

    @Override
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // TODO change the password to hash check
        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    @Override
    @Transactional
    public User deleteUser(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        userRepository.delete(user);

        return user;
    }

    public List<String> getUserPrefGenres(Long userId){
        if(userId!=0){
            User user = userRepository.findById(userId)
                    .orElseThrow(()->new RuntimeException("user not found"));

            if (user.getGenrePref() == null || user.getGenrePref().trim().isEmpty()) {
                return Collections.emptyList();
            }

            return Arrays.stream(user.getGenrePref().split(","))
                    .map(String::trim)
                    .filter(genre -> !genre.isEmpty())
                    .toList();

        }
        return null;
    }

}
