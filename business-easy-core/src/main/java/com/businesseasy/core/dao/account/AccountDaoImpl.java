package com.businesseasy.core.dao.account;

import com.businesseasy.core.common.SearchCriteria;
import com.businesseasy.core.common.SearchOperation;
import com.businesseasy.core.exception_handler.ReasonCode;
import com.businesseasy.core.specification.EntitySpecification;
import com.businesseasy.core.common.model.Account;
import com.businesseasy.core.entities.AccountEntity;
import com.businesseasy.core.exception_handler.InvalidRequestException;
import com.businesseasy.core.repositories.AccountRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class AccountDaoImpl implements AccountDao {
    @Autowired
    AccountRepository accountRepository;

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
    public AccountEntity createAccount(Account request) {
        validateAccountCreationRequest(request);

        return accountRepository.save(AccountEntity.builder()
                .accountName(request.getAccountName())
                .holderName(request.getHolderName())
                .bank(request.getBank())
                .branch(request.getBranch())
                .accountNo(request.getAccountNo())
                .balance(request.getBalance())
                .build());
    }

    @Override
    public AccountEntity updateAccount(Account request) {
        validateAccountUpdateRequest(request);

        return accountRepository.save(modelMapper.map(request, AccountEntity.class));
    }

    @Override
    public List<AccountEntity> getAllAccount() {
        return accountRepository.findAll();
    }

    @Override
    public List<AccountEntity> getAccountByIds(List<Long> idList) {
        return accountRepository.findByIdIn(idList);
    }

    void validateAccountUpdateRequest(Account request) {
        Optional<AccountEntity> entity = accountRepository.findById(request.getId());
        if(!entity.isPresent()) {
            throw new InvalidRequestException(ReasonCode.ACCOUNT_NOT_FOUND.getMessage());
        }

        entity = accountRepository.findByAccountName(request.getAccountName());

        if (entity.isPresent()) {
            if(!entity.get().getId().equals(request.getId())) {
                throw new InvalidRequestException(ReasonCode.DUPLICATE_ACCOUNT_NAME_FOUND.getMessage());
            }
        }
    }

    void validateAccountCreationRequest(Account request) {
        Optional<AccountEntity> entity = accountRepository.findByAccountNo(request.getAccountNo());

        if(entity.isPresent()) {
            throw new InvalidRequestException(ReasonCode.DUPLICATE_ACCOUNT_NO_FOUND.getMessage());
        }

        entity = accountRepository.findByAccountName(request.getAccountName());

        if (entity.isPresent()) {
            throw new InvalidRequestException(ReasonCode.DUPLICATE_ACCOUNT_NAME_FOUND.getMessage());
        }

    }
}
