package com.example.businesseasycore.dao.place;

import com.example.businesseasycore.common.model.Place;
import com.example.businesseasycore.entities.PlaceEntity;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface PlaceDao {
    Page<PlaceEntity> getPlace(Map<String, String> parameterMap);

    PlaceEntity updatePlace(Place request);

    Integer createPlace(Place request);
}
