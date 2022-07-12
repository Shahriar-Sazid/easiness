package com.businesseasy.core.common;

import com.google.gson.Gson;

import java.text.ParseException;
import java.time.Instant;
import java.util.Date;

public class Util {

    public static String parseObjectToString(Object object) {
        return new Gson().toJson(object);
    }

    public static <T> T parseStringToObject(String json, Class<T> classObject) {
        try {
            return new Gson().fromJson(json, classObject);
        } catch (Exception e) {
            return null;
        }
    }
    
    public static String concatWith(Object a, Object b, String delimiter) {
        return a.toString().concat(delimiter).concat(b.toString());
    }

    public static Date parseDate(String dateStr) throws ParseException {
        return Date.from(Instant.parse(dateStr));
    }
}
