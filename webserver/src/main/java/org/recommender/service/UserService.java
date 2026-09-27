package org.recommender.service;

import org.recommender.entity.User;

import java.util.List;

public interface UserService {
    List<User> findAll();
    User signup(String email, String password, String userName, String genrePref);
    User login(String email, String password);
    User deleteUser(String email, String password);
    List<String> getUserPrefGenres (Long userId);

}
