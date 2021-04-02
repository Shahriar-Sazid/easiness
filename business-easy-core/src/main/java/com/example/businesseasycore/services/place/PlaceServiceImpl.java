package com.example.businesseasycore.services.place;

import com.example.businesseasycore.common.model.Account;
import com.example.businesseasycore.common.model.Place;
import com.example.businesseasycore.dao.place.PlaceDao;
import com.example.businesseasycore.entities.PlaceEntity;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PlaceServiceImpl implements PlaceService{
    PlaceDao placeDao;

    @Override
    public Page<PlaceEntity> getPlace(Map<String, String> parameterMap) {
        return placeDao.getPlace(parameterMap);
    }

    @Override
    public Integer createPlace(Place request) {
        return placeDao.createPlace(request);
    }

    @Override
    public PlaceEntity updatePlace(Place request) {
        return placeDao.updatePlace(request);
    }
}
