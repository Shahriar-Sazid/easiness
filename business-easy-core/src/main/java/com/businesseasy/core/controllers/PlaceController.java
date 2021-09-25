package com.businesseasy.core.controllers;

import com.businesseasy.core.common.model.Place;
import com.businesseasy.core.entities.PlaceEntity;
import com.businesseasy.core.services.place.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/place")
public class PlaceController {
    @Autowired
    PlaceService placeService;

    @GetMapping("")
    Page<PlaceEntity> getPeople(@RequestParam Map<String, String> parameterMap) {
        return placeService.getPlace(parameterMap);
    }

    @PostMapping("")
    Integer createAccount(@Valid @RequestBody Place request) {
        return placeService.createPlace(request);
    }

    @PutMapping("")
    PlaceEntity updateAccount(@Valid @RequestBody Place request) {
        return placeService.updatePlace(request);
    }


}
