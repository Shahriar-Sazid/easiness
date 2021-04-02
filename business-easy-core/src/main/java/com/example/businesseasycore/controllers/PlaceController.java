package com.example.businesseasycore.controllers;

import com.example.businesseasycore.common.model.Account;
import com.example.businesseasycore.common.model.Place;
import com.example.businesseasycore.entities.PeopleEntity;
import com.example.businesseasycore.entities.PlaceEntity;
import com.example.businesseasycore.services.place.PlaceService;
import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.FileNotFoundException;
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
