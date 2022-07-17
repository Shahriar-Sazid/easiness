package com.easiness.core.auth.services;

import com.easiness.core.auth.model.Role;
import com.easiness.core.auth.model.User;

import java.util.List;

public interface UserService {
    User saveUser(User user);
    Role saveRole(Role role);
    void addRoleToUser(String username, String roleName);
    User getUser(String username);
    List<User> getUsers();
}
