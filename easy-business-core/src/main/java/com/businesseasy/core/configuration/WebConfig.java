package com.businesseasy.core.configuration;

import lombok.SneakyThrows;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.net.InetAddress;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @SneakyThrows
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String localIp = InetAddress.getLocalHost().getHostAddress();
        registry.addMapping("/api/**")
                .allowedOrigins("http://" + localIp + ":4200", "http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}