package com.easiness.core.services.tx;

import com.easiness.core.common.Util;
import com.easiness.core.common.enums.TxType;
import com.easiness.core.common.model.Payment;
import com.easiness.core.common.model.PaymentTx;
import com.easiness.core.common.model.Tx;
import com.easiness.core.entities.TxEntity;
import com.easiness.core.repositories.AccountRepository;
import com.easiness.core.repositories.DocumentRepository;
import com.easiness.core.repositories.PeopleRepository;
import com.easiness.core.repositories.TxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
                    .document(paymentTx.getDocId() != null ? documentRepository.getOne(paymentTx.getDocId()): null)
                    .people(paymentTx.getPeopleId() != null? peopleRepository.getOne(paymentTx.getPeopleId()): null)
                    .type(getType(payment))
                    .ref(paymentTx.getRef())
                    .build());
        }

        txRepository.saveAll(txEntityList);
    }

    public Page<Tx> searchTx(Map<String, String> params) {
        Pageable pageable = PageRequest.of(Integer.parseInt(params.getOrDefault("page", "1")) - 1,
                Integer.parseInt(params.getOrDefault("pageSize", "10")),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        try {
            return txRepository.searchTx(
                    Util.parseDate(params.getOrDefault("from", "2022-01-01T00:00:00.000Z")),
                    Util.parseDate(params.getOrDefault("to", "2099-01-01T00:00:00.000Z")),
                    params.get("type") == null ? null: TxType.valueOf(params.get("type").toUpperCase()),
                    params.getOrDefault("peopleName", ""),
                    params.get("account") == null ? null: Long.parseLong(params.get("account")),
                    pageable);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
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
