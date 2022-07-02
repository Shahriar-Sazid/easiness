package com.businesseasy.core.exception_handler;

public enum ReasonCode {
    PRODUCT_ALREADY_EXISTING("One or more products are already existing!"),
    DUPLICATE_PRODUCT_FOUND("Duplicate product found, product update failed!"),
    PEOPLE_WITH_SAME_NAME_AND_COMPANY_FOUND("People with same name and company found/ Duplicate contact no found"),
    DUPLICATE_CONTACT_NO_FOUND("Someone already has this contact number!"),
    DUPLICATE_ACCOUNT_NO_FOUND("Account no already taken"),
    DUPLICATE_ACCOUNT_NAME_FOUND("Duplicate account no found"),
    DUPLICATE_PLACE_NAME_FOUND("Duplicate place name found"),
    ACCOUNT_NOT_FOUND("Account not found"),
    PLACE_NOT_FOUND("Place not found"),
    PEOPLE_NOT_FOUND("Supplier/Customer not found"),
    PEOPLE_WITH_ID_NOT_FOUND("People with given id not found"),


    USER_NOT_FOUND("User not fond");

    private final String message;

    public String getMessage() {
        return message;
    }

    ReasonCode(String message) {
        this.message = message;
    }
}
