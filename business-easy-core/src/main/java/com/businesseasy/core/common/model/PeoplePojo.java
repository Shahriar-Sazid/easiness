package com.businesseasy.core.common.model;

import com.businesseasy.core.common.enums.PeopleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeoplePojo {
    Integer id;
    String name;
    String companyName;
    String address;
    String email;
    PeopleType type;
    BigDecimal balance;
    String contactNo;
    Integer contactNoId;
}
