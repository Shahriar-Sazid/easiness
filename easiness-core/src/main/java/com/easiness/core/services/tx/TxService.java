package com.easiness.core.services.tx;

import com.easiness.core.common.model.PaymentTx;
import com.easiness.core.common.model.Tx;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface TxService {
    void saveTx(PaymentTx paymentTx);
    Page<Tx> searchTx(Map<String, String> params);
}
