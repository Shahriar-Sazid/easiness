package com.businesseasy.core.services.place;

import com.businesseasy.core.common.model.Place;
import com.businesseasy.core.dao.place.PlaceDao;
import com.businesseasy.core.entities.PlaceEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PlaceServiceImpl implements PlaceService{
    @Autowired
    PlaceDao placeDao;

    @Override
    public Page<PlaceEntity> getPlace(Map<String, String> parameterMap) {
        return placeDao.getPlace(parameterMap);
    }

    @Override
    public Long createPlace(Place request) {
        return placeDao.createPlace(request);
    }

    @Override
    public PlaceEntity updatePlace(Place request) {
        return placeDao.updatePlace(request);
    }
}
