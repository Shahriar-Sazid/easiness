package com.easiness.core.controllers;

import com.easiness.core.common.model.Document;
import com.easiness.core.common.model.DocumentDTO;
import com.easiness.core.services.document.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/document")
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
