package com.businesseasy.core.common.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    Integer id;

    @NotNull(message = "Account name must not be null")
    @NotBlank(message = "Account name must not be blank")
    String accountName;

    String holderName;
    String bank;
    String branch;
    String accountNo;

    @NotNull(message = "Account name must not be null")
    BigDecimal balance;
}
