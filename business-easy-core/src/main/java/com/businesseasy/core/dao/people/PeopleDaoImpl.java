package com.businesseasy.core.dao.people;

import com.businesseasy.core.common.SearchCriteria;
import com.businesseasy.core.common.SearchOperation;
import com.businesseasy.core.common.enums.PeopleType;
import com.businesseasy.core.common.model.PeoplePojo;
import com.businesseasy.core.entities.PeopleEntity;
import com.businesseasy.core.exception_handler.ReasonCode;
import com.businesseasy.core.repositories.ContactNoRepository;
import com.businesseasy.core.repositories.PeopleRepository;
import com.businesseasy.core.specification.EntitySpecification;
import com.businesseasy.core.common.model.People;
import com.businesseasy.core.entities.ContactNoEntity;
import com.businesseasy.core.exception_handler.InvalidRequestException;
import com.businesseasy.core.exception_handler.UniqueConstraintsViolationException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class PeopleDaoImpl implements PeopleDao {
    @Autowired
    PeopleRepository peopleRepository;

    @Autowired
    ContactNoRepository contactNoRepository;

    @Autowired
    ModelMapper modelMapper;

    @Override
    public Page<PeopleEntity> getPeople(Map<String, String> parameterMap) {
        EntitySpecification<PeopleEntity> entitySpecification = new EntitySpecification<>();

        entitySpecification.add(new SearchCriteria("name", parameterMap.get("name"), SearchOperation.MATCH));
        entitySpecification.add(new SearchCriteria(
                "contactNo", parameterMap.get("contactNo"), SearchOperation.EQUAL_IN_CHILDREN, "contactNoList"));


        int page = parameterMap.containsKey("page") ? Integer.parseInt(parameterMap.get("page")) - 1 : 0;
        int pageSize = parameterMap.containsKey("pageSize") ? Integer.parseInt(parameterMap.get("pageSize")) : 10;

        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("name", "id"));

        return peopleRepository.findAll(entitySpecification, pageable);
    }

    private List<ContactNoEntity> toContactNoList(List<String> contactNoList, Integer ownerId) {
        return contactNoList.stream()
                .map(contactNo -> ContactNoEntity
                        .builder()
                        .contactNo(contactNo)
                        .ownerId(ownerId)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public Integer insertPeople(People request) {
        Integer peopleId;
        try {
            peopleId = peopleRepository.save(
                    PeopleEntity
                            .builder()
                            .name(request.getName())
                            .companyName(request.getCompanyName())
                            .address(request.getAddress())
                            .email(request.getEmail())
                            .type(request.getType())
                            .balance(request.getBalance())
                            .contactNoList(toContactNoList(request.getContactNo(), null))
                            .build()
            ).getId();
        } catch (DataIntegrityViolationException e) {
            throw new UniqueConstraintsViolationException(ReasonCode.PEOPLE_WITH_SAME_NAME_AND_COMPANY_FOUND.getMessage());
        }
        return peopleId;
    }


    @Override
    @Transactional
    public People updatePeople(People request) {
        Optional<PeopleEntity> peopleEntityOptional = peopleRepository.findById(request.getId());

        if(!peopleEntityOptional.isPresent()) {
            throw new InvalidRequestException(ReasonCode.PEOPLE_WITH_ID_NOT_FOUND.getMessage());
        } else {
            PeopleEntity peopleEntity = peopleEntityOptional.get();
            peopleEntity.setName(request.getName());
            peopleEntity.setCompanyName(request.getCompanyName());
            peopleEntity.setAddress(request.getAddress());
            peopleEntity.setBalance(request.getBalance());
            peopleEntity.setEmail(request.getEmail());
            peopleEntity.setBalance(request.getBalance());
            peopleEntity.setType(request.getType());
            checkAndSaveContactNo(request.getContactNo(), peopleEntity);
            peopleRepository.save(peopleEntity);

            return modelMapper
                    .typeMap(PeopleEntity.class, People.class)
                    .addMappings(mapper -> mapper.skip(People::setId))
                    .addMappings(mapper -> mapper.skip(People::setBalance))
                    .map(peopleEntity);
        }
    }



    @Override
    public List<PeoplePojo> getAllCustomer() {
//        return peopleRepository.findByTypeNotIn(Collections.singletonList(PeopleType.SUPPLIER));
        return peopleRepository.findAllCustomer();
    }

    @Override
    public List<PeopleEntity> getAllSupplier() {
        return peopleRepository.findByTypeNotIn(Collections.singletonList(PeopleType.CUSTOMER));
    }

    void checkAndSaveContactNo(List<String> contactNoList, PeopleEntity owner) {
        for (String contactNo : contactNoList) {
            Optional<ContactNoEntity> contactNoEntity = contactNoRepository.findByContactNo(contactNo);
            if (contactNoEntity.isPresent()) {
                if (!contactNoEntity.get().getOwnerId().equals(owner.getId())) {
                    throw new UniqueConstraintsViolationException(ReasonCode.DUPLICATE_CONTACT_NO_FOUND.getMessage());
                }
            } else {
//                contactNoRepository.save(ContactNoEntity.builder().contactNo(contactNo).ownerId(owner.getId()).build());
                owner.getContactNoList().add(ContactNoEntity.builder().contactNo(contactNo).ownerId(owner.getId()).build());
            }
        }
        List<ContactNoEntity> ownerContactNoList = contactNoRepository.findAllByOwnerId(owner.getId());
        for(ContactNoEntity contactNoEntity: ownerContactNoList) {
            String result = contactNoList.stream()
                    .filter(item -> item.equals(contactNoEntity.getContactNo()))
                    .findAny()
                    .orElse(null);
            if(result == null) {
                owner.getContactNoList().remove(contactNoEntity);
//               contactNoRepository.delete(contactNoEntity);
            }
        }
    }
}
