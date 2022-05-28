package com.businesseasy.core.common;

import com.google.gson.Gson;

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
}
