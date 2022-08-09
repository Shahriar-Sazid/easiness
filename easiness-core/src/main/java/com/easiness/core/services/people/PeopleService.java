package com.easiness.core.services.people;

import com.easiness.core.common.model.Invoice;
import com.easiness.core.common.model.Payment;
import com.easiness.core.common.model.People;
import com.easiness.core.common.model.PurchaseOrder;
import com.easiness.core.entities.PeopleEntity;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface PeopleService {
    Page<PeopleEntity> getPeople(Map<String, String> parameterMap);

    Long insertPeople(People request);

    People updatePeople(People request);

    ResponseEntity<ByteArrayResource> downloadPeopleReport(Map<String, String> parameterMap);

    List<PeopleEntity> getAllCustomer();

    List<PeopleEntity> getAllSupplier();

    People getPeopleById(Long id);

    void updateSupplierBalance(PurchaseOrder purchaseOrder);

    void updateCustomerBalance(Invoice invoice);

    void updateCustomerBalanceAfterPayment(Long peopleId, List<Payment> paymentList);
}
