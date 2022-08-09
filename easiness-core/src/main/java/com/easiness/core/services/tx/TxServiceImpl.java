package com.easiness.core.services.tx;

import com.easiness.core.common.enums.TxType;
import com.easiness.core.common.model.Payment;
import com.easiness.core.common.model.PaymentTx;
import com.easiness.core.entities.TxEntity;
import com.easiness.core.repositories.AccountRepository;
import com.easiness.core.repositories.DocumentRepository;
import com.easiness.core.repositories.PeopleRepository;
import com.easiness.core.repositories.TxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TxServiceImpl implements TxService {

    @Autowired
    TxRepository txRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    DocumentRepository documentRepository;

    @Autowired
    PeopleRepository peopleRepository;

    @Override
    public void saveTx(PaymentTx paymentTx) {
        List<TxEntity> txEntityList = new ArrayList<>();
        for (Payment payment : paymentTx.getPayments()) {
            txEntityList.add(TxEntity.builder()
                    .amount(payment.getAmount())
                    .fromAccount(payment.getFromAccount() != null ? accountRepository.getOne(payment.getFromAccount()): null)
                    .toAccount(payment.getToAccount() != null ? accountRepository.getOne(payment.getToAccount()): null)
                    .documentEntity(paymentTx.getDocId() != null ? documentRepository.getOne(paymentTx.getDocId()): null)
                    .peopleEntity(paymentTx.getPeopleId() != null? peopleRepository.getOne(paymentTx.getPeopleId()): null)
                    .type(getType(payment))
                    .ref(paymentTx.getRef())
                    .build());
        }

        txRepository.saveAll(txEntityList);
    }

    public TxType getType(Payment payment) {
        if (payment.getToAccount() != null && payment.getFromAccount() != null) {
            return TxType.BANK_TRANSFER;
        } else if (payment.getFromAccount() != null) {
            return TxType.EXPENSE;
        } else if (payment.getToAccount() != null) {
            return TxType.INCOME;
        }
        return null;
    }

}
