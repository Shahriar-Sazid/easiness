package com.example.businesseasycore.controllers;

import com.example.businesseasycore.common.model.People;
import com.example.businesseasycore.entities.PeopleEntity;
import com.example.businesseasycore.services.people.PeopleService;
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
@RequestMapping("/api/people")
public class PeopleController {
    @Autowired
    PeopleService peopleService;


    @GetMapping("")
    Page<PeopleEntity> getPeople(@RequestParam Map<String, String> parameterMap) {
        return peopleService.getPeople(parameterMap);
    }

    @PostMapping("")
    Integer insertPeople(@Valid @RequestBody People request) {
        return peopleService.insertPeople(request);
    }

    @PutMapping("")
    People updatePeople(@Valid @RequestBody People request) {
        return peopleService.updatePeople(request);
    }

    @RequestMapping(value = "/report", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE, method = RequestMethod.GET)
    public ResponseEntity<ByteArrayResource> downloadProductReport(@RequestParam Map<String, String> parameterMap) throws FileNotFoundException, JRException {
        return peopleService.downloadPeopleReport(parameterMap);
    }
}
