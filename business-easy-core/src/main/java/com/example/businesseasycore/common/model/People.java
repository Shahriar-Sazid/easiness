package com.example.businesseasycore.common.model;

import com.example.businesseasycore.common.enums.PeopleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class People {
    Integer id;

    @NotNull(message = "People name must not be null")
    @NotBlank(message = "People name must not be blank")
    String name;

    @NotNull(message = "Company name must not be null")
    @NotBlank(message = "Company name must not be blank")
    String companyName;

    String address;

    String email;

    @NotNull(message = "People type must not be null")
    PeopleType type;


    @NotNull(message = "People balance must not be null")
    Double balance;

    @NotNull(message = "Contact number list must not be null")
    @NotEmpty(message = "Contact number list must not be empty")
    List<String> contactNo;

    String typeStr;
    String contactNoStr;
}
