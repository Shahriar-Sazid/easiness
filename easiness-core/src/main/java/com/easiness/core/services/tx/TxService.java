package com.easiness.core.services.tx;

import com.easiness.core.common.model.PaymentTx;

public interface TxService {
    void saveTx(PaymentTx paymentTx);
}
