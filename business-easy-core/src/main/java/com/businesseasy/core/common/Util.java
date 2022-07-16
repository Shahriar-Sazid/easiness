package com.businesseasy.core.common;

import com.businesseasy.core.configuration.HibernateProxyTypeAdapter;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.text.ParseException;
import java.time.Instant;
import java.util.Date;

public class Util {
    static Gson gson;

    static {
        GsonBuilder b = new GsonBuilder();
        b.registerTypeAdapterFactory(HibernateProxyTypeAdapter.FACTORY);
        gson = b.create();
    }

    public static String parseObjectToString(Object object) {
        return gson.toJson(object);
    }

    public static <T> T parseStringToObject(String json, Class<T> classObject) {
        try {
            return gson.fromJson(json, classObject);
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
