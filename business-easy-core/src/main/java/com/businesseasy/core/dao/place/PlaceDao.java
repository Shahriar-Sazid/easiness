package com.businesseasy.core.dao.place;

import com.businesseasy.core.common.model.Place;
import com.businesseasy.core.entities.PlaceEntity;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface PlaceDao {
    Page<PlaceEntity> getPlace(Map<String, String> parameterMap);

    PlaceEntity updatePlace(Place request);

    Long createPlace(Place request);
}
