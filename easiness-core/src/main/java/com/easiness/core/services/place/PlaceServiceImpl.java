package com.easiness.core.services.place;

import com.easiness.core.common.SearchCriteria;
import com.easiness.core.common.SearchOperation;
import com.easiness.core.common.model.Place;
import com.easiness.core.entities.PlaceEntity;
import com.easiness.core.exception_handler.InvalidRequestException;
import com.easiness.core.exception_handler.ReasonCode;
import com.easiness.core.exception_handler.UniqueConstraintsViolationException;
import com.easiness.core.repositories.PlaceRepository;
import com.easiness.core.specification.EntitySpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class PlaceServiceImpl implements PlaceService{
    @Autowired
    PlaceRepository placeRepository;

    @Override
    public Page<PlaceEntity> getPlace(Map<String, String> parameterMap) {
        EntitySpecification<PlaceEntity> entitySpecification = new EntitySpecification<>();

        entitySpecification.add(new SearchCriteria("name", parameterMap.get("name"), SearchOperation.MATCH));

        int page = parameterMap.containsKey("page") ? Integer.parseInt(parameterMap.get("page")) - 1 : 0;
        int pageSize = parameterMap.containsKey("pageSize") ? Integer.parseInt(parameterMap.get("pageSize")) : 10;

        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("name"));

        return placeRepository.findAll(entitySpecification, pageable);
    }

    @Override
    public Long createPlace(Place request) {
        Optional<PlaceEntity> entity = placeRepository.findByName(request.getName());

        if (entity.isPresent()) {
            throw new UniqueConstraintsViolationException(ReasonCode.DUPLICATE_PLACE_NAME_FOUND.getMessage());
        }

        return placeRepository.save(PlaceEntity
                .builder()
                .name(request.getName())
                .address(request.getAddress())
                .build()).getId();
    }

    @Override
    public PlaceEntity updatePlace(Place request) {
        Optional<PlaceEntity> entity = placeRepository.findById(request.getId());
        if (!entity.isPresent()) {
            throw new InvalidRequestException(ReasonCode.PLACE_NOT_FOUND.getMessage());
        }
        entity = placeRepository.findByName(request.getName());
        if (entity.isPresent()) {
            if (!entity.get().getId().equals(request.getId())) {
                throw new UniqueConstraintsViolationException(ReasonCode.DUPLICATE_PLACE_NAME_FOUND.getMessage());
            }
        }

        return placeRepository.save(PlaceEntity
                .builder()
                .name(request.getName())
                .address(request.getAddress())
                .id(request.getId())
                .build());
    }
}
