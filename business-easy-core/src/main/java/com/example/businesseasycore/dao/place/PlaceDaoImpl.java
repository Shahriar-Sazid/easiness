package com.example.businesseasycore.dao.place;

import com.example.businesseasycore.common.SearchCriteria;
import com.example.businesseasycore.common.SearchOperation;
import com.example.businesseasycore.common.model.Place;
import com.example.businesseasycore.entities.PlaceEntity;
import com.example.businesseasycore.exception_handler.InvalidRequestException;
import com.example.businesseasycore.exception_handler.ReasonCode;
import com.example.businesseasycore.exception_handler.UniqueConstraintsViolationException;
import com.example.businesseasycore.repositories.PlaceRepository;
import com.example.businesseasycore.specification.EntitySpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Map;
import java.util.Optional;

public class PlaceDaoImpl implements PlaceDao {
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

    @Override
    public Integer createPlace(Place request) {
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
}
