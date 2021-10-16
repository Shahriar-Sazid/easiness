package com.businesseasy.core.logging;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RequestLoggingFilterConfig {

    @Bean
    public FilterRegistrationBean<CustomUrlFilter> filterRegistrationBean() {
        FilterRegistrationBean<CustomUrlFilter> registrationBean = new FilterRegistrationBean();
        CustomUrlFilter customURLFilter = new CustomUrlFilter();

        registrationBean.setFilter(customURLFilter);
        registrationBean.setOrder(2); //set precedence
        return registrationBean;
    }
}