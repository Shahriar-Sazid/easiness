package com.easiness.core.logging;


import com.easiness.core.common.Util;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Service
@Slf4j
public class LoggingService {
    private static final String REQUEST_ID = "request_id";

    public void logRequestBody(HttpServletRequest httpServletRequest, Object body) {
        if (httpServletRequest.getRequestURI().contains("medias")) {
            return;
        }
        Object requestId = httpServletRequest.getAttribute(REQUEST_ID);

        StringBuilder data = new StringBuilder();
        data.append("\nLOGGING REQUEST BODY-----------------------------------\n")
                .append("[REQUEST-ID]: ").append(requestId).append("\n")
                .append("[BODY REQUEST]: ").append("\n\n")
                .append(Util.parseObjectToString(body))
                .append("\n\n")
                .append("LOGGING REQUEST BODY-----------------------------------\n");

        log.info(data.toString());
    }

    public void logResponse(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object body) {
        if (httpServletRequest.getRequestURI().contains("medias")) {
            return;
        }
        Object requestId = httpServletRequest.getAttribute(REQUEST_ID);
        StringBuilder data = new StringBuilder();
        data.append("\n----------------- LOGGING RESPONSE START FOR REQUEST ID: ").append(requestId).append(" -----------------\n")
                .append("[BODY RESPONSE]: ").append("\n")
                .append(Util.parseObjectToString(body))
                .append("\n----------------- LOGGING RESPONSE END FOR REQUEST ID: ").append(requestId).append(" --------------------\n");

        log.info(data.toString());
    }
}