package com.example.businesseasycore.services.place;

import com.example.businesseasycore.common.model.Account;
import com.example.businesseasycore.common.model.Place;
import com.example.businesseasycore.entities.PeopleEntity;
import com.example.businesseasycore.entities.PlaceEntity;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface PlaceService {
    Page<PlaceEntity> getPlace(Map<String, String> parameterMap);

    Integer createPlace(Place request);

    PlaceEntity updatePlace(Place request);
}
