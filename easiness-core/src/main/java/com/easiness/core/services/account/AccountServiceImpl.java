package com.easiness.core.services.account;

import com.easiness.core.common.SearchCriteria;
import com.easiness.core.common.SearchOperation;
import com.easiness.core.common.model.Account;
import com.easiness.core.common.model.Payment;
import com.easiness.core.entities.AccountEntity;
import com.easiness.core.exception_handler.InvalidRequestException;
import com.easiness.core.exception_handler.ReasonCode;
import com.easiness.core.repositories.AccountRepository;
import com.easiness.core.services.report.ReportService;
import com.easiness.core.specification.EntitySpecification;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    ReportService reportService;

    @Autowired
    ModelMapper modelMapper;

    @Override
    public Page<AccountEntity> getAccount(Map<String, String> parameterMap) {
        EntitySpecification<AccountEntity> entitySpecification = new EntitySpecification<>();

        entitySpecification.add(new SearchCriteria("accountName", parameterMap.get("accountName"), SearchOperation.MATCH));
        entitySpecification.add(new SearchCriteria("accountNo", parameterMap.get("accountNo"), SearchOperation.EQUAL));

        int page = parameterMap.containsKey("page") ? Integer.parseInt(parameterMap.get("page")) - 1 : 0;
        int pageSize = parameterMap.containsKey("pageSize") ? Integer.parseInt(parameterMap.get("pageSize")) : 10;

        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("accountName", "id"));

        return accountRepository.findAll(entitySpecification, pageable);
    }

    @Override
    public Long createAccount(Account request) {
        validateAccountCreationRequest(request);

        return accountRepository.save(AccountEntity.builder()
                .accountName(request.getAccountName())
                .holderName(request.getHolderName())
                .bank(request.getBank())
                .branch(request.getBranch())
                .accountNo(request.getAccountNo())
                .balance(request.getBalance())
                .build()).getId();
    }

    @Override
    public AccountEntity updateAccount(Account request) {
        validateAccountUpdateRequest(request);

        return accountRepository.save(modelMapper.map(request, AccountEntity.class));
    }

    @Override
    public ResponseEntity<ByteArrayResource> downloadAccountReport(Map<String, String> parameterMap) {
        Page<AccountEntity> accountEntityPage = getAccount(parameterMap);
        List<AccountEntity> accountEntityList = accountEntityPage.getContent();

        return reportService.createAccountReport(accountEntityList,
                Optional.ofNullable(parameterMap.get("activeFilters")).orElse("<NO FILTER>"));
    }

    @Override
    public Map<Long, AccountEntity> getAllAccount() {
        return accountRepository.findAll().stream()
                .collect(Collectors.toMap(AccountEntity::getId, accountEntity -> accountEntity));
    }

    @Override
    public void updateAccountBalance(List<Payment> payments) {
        if (payments != null) {

            List<AccountEntity> accountEntities = accountRepository.findByIdIn(
                    Stream.concat(
                            payments.stream().map(Payment::getFromAccount).filter(Objects::nonNull),
                            payments.stream().map(Payment::getToAccount).filter(Objects::nonNull)
                    ).collect(Collectors.toList()));

            Map<Long, AccountEntity> accountMap = accountEntities.stream().collect(Collectors.toMap(AccountEntity::getId, item -> item));

            for (Payment payment : payments) {
                if (payment.getFromAccount() != null) {
                    AccountEntity account = accountMap.get(payment.getFromAccount());
                    account.setBalance(account.getBalance().add(
                            payment.getAmount().compareTo(BigDecimal.ZERO) > 0 ?
                                    payment.getAmount().negate() : payment.getAmount()));
                }
                if (payment.getToAccount() != null) {
                    AccountEntity account = accountMap.get(payment.getToAccount());
                    account.setBalance(account.getBalance().add(
                            payment.getAmount().compareTo(BigDecimal.ZERO) > 0 ?
                                    payment.getAmount() : payment.getAmount().negate()));
                }
            }

            accountRepository.saveAll(accountEntities);
        }
    }

    void validateAccountCreationRequest(Account request) {
        Optional<AccountEntity> entity = accountRepository.findByAccountNo(request.getAccountNo());

        if (entity.isPresent()) {
            throw new InvalidRequestException(ReasonCode.DUPLICATE_ACCOUNT_NO_FOUND.getMessage());
        }

        entity = accountRepository.findByAccountName(request.getAccountName());

        if (entity.isPresent()) {
            throw new InvalidRequestException(ReasonCode.DUPLICATE_ACCOUNT_NAME_FOUND.getMessage());
        }

    }

    void validateAccountUpdateRequest(Account request) {
        Optional<AccountEntity> entity = accountRepository.findById(request.getId());
        if (!entity.isPresent()) {
            throw new InvalidRequestException(ReasonCode.ACCOUNT_NOT_FOUND.getMessage());
        }

        entity = accountRepository.findByAccountName(request.getAccountName());

        if (entity.isPresent()) {
            if (!entity.get().getId().equals(request.getId())) {
                throw new InvalidRequestException(ReasonCode.DUPLICATE_ACCOUNT_NAME_FOUND.getMessage());
            }
        }
    }
}
