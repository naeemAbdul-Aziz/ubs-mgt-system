package com.drakalabs.schoolmngsys.shared.security;

import org.springframework.stereotype.Component;

@Component("securityService")
public class SecurityContextBean {

    public boolean isStaff() {
        return "STAFF".equals(SecurityUtils.getCurrentPersonType());
    }

    public boolean isStudent() {
        return "STUDENT".equals(SecurityUtils.getCurrentPersonType());
    }

    public boolean isGuardian() {
        return "GUARDIAN".equals(SecurityUtils.getCurrentPersonType());
    }
}
