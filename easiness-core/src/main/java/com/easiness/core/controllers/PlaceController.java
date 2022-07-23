package com.easiness.core.controllers;

import com.easiness.core.common.model.Place;
import com.easiness.core.entities.PlaceEntity;
import com.easiness.core.services.place.PlaceService;
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
    Page<PlaceEntity> getPlace(@RequestParam Map<String, String> parameterMap) {
        return placeService.getPlace(parameterMap);
    }

    @GetMapping("/all")
    Map<Long, PlaceEntity> getAllPlace() {
        return placeService.getAllPlace();
    }

    @PostMapping("")
    Long createAccount(@Valid @RequestBody Place request) {
        return placeService.createPlace(request);
    }

    @PutMapping("")
    PlaceEntity updateAccount(@Valid @RequestBody Place request) {
        return placeService.updatePlace(request);
    }


}
