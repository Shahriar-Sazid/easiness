package com.easiness.core.services.place;

import com.easiness.core.common.model.Place;
import com.easiness.core.entities.PlaceEntity;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface PlaceService {
    Page<PlaceEntity> getPlace(Map<String, String> parameterMap);

    Long createPlace(Place request);

    PlaceEntity updatePlace(Place request);
}
