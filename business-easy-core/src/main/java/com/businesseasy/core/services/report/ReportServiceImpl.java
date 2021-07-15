package com.businesseasy.core.services.report;

import com.businesseasy.core.common.model.People;
import com.businesseasy.core.entities.ProductEntity;
import com.businesseasy.core.entities.AccountEntity;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.util.JRLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportServiceImpl implements ReportService {
    @Autowired
    ResourceLoader resourceLoader;

    private ResponseEntity<ByteArrayResource> generateReportFromThisParams(JasperReport jasperReport, Map<String, Object> parameters, JRDataSource dataSource, String fileName, MediaType mediaType) {
        byte[] report = null;
        JasperPrint jasperPrint;
        try {
            jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
            if (mediaType == MediaType.APPLICATION_PDF) {
                report = JasperExportManager.exportReportToPdf(jasperPrint);
                fileName += ".pdf";
            }
        } catch (JRException e) {
            e.printStackTrace();
        }
        assert report != null;
        ByteArrayResource byteArrayResource = new ByteArrayResource(report);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + fileName)
                .contentType(mediaType)
                .body(byteArrayResource);
    }

    @Override
    public ResponseEntity<ByteArrayResource> createProductReport(List<ProductEntity> productList, String activeFilters) {
        ResponseEntity<ByteArrayResource> generatedReport = null;
        try {
            Resource reportTemplate = resourceLoader.getResource("classpath:reports/product.jasper");
            JasperReport jasperReport = (JasperReport) JRLoader.loadObject(reportTemplate.getFile());

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("ProductBeanCollection", new JRBeanCollectionDataSource(productList));
            parameters.put("activeFilters", activeFilters);

            generatedReport = generateReportFromThisParams(jasperReport, parameters, new JREmptyDataSource(), "Product_List", MediaType.APPLICATION_PDF);

        } catch (JRException | IOException e) {
            e.printStackTrace();
        }
        return generatedReport;
    }

    @Override
    public ResponseEntity<ByteArrayResource> createPeopleReport(List<People> peopleList, String activeFilters) {
        ResponseEntity<ByteArrayResource> generatedReport = null;
        try {
            Resource reportTemplate = resourceLoader.getResource("classpath:reports/people.jasper");
            JasperReport jasperReport = (JasperReport) JRLoader.loadObject(reportTemplate.getFile());

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("PeopleBeanCollection", new JRBeanCollectionDataSource(peopleList));
            parameters.put("activeFilters", activeFilters);

            generatedReport = generateReportFromThisParams(jasperReport, parameters, new JREmptyDataSource(), "People_List", MediaType.APPLICATION_PDF);

        } catch (JRException | IOException e) {
            e.printStackTrace();
        }
        return generatedReport;
    }

    @Override
    public ResponseEntity<ByteArrayResource> createAccountReport(List<AccountEntity> accountEntityList, String activeFilters) {
        ResponseEntity<ByteArrayResource> generatedReport = null;
        try {
            Resource reportTemplate = resourceLoader.getResource("classpath:reports/account.jasper");
            JasperReport jasperReport = (JasperReport) JRLoader.loadObject(reportTemplate.getFile());

            Map<String, Object> parameters = new HashMap<>();
            parameters.put("AccountBeanCollection", new JRBeanCollectionDataSource(accountEntityList));
            parameters.put("activeFilters", activeFilters);

            generatedReport = generateReportFromThisParams(jasperReport, parameters, new JREmptyDataSource(), "Account_List", MediaType.APPLICATION_PDF);

        } catch (JRException | IOException e) {
            e.printStackTrace();
        }
        return generatedReport;
    }
}
