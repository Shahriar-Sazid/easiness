package com.businesseasy.core.controllers;

import com.businesseasy.core.common.model.Document;
import com.businesseasy.core.common.model.DocumentDTO;
import com.businesseasy.core.services.document.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/document")
public class DocumentController {

    @Autowired
    DocumentService documentService;

    @GetMapping("")
    Page<Document> searchDocument(@RequestParam Map<String, String> params) {
        return documentService.searchDocument(params);
    }

    @GetMapping("/{id}")
    DocumentDTO findDocumentById(@PathVariable(name = "id") Long id) {
        return documentService.findDocumentById(id);
    }



}
