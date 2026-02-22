package com.lifeline.model;

import lombok.Data;

@Data
public class BloodTestResult {
    private String bloodBagId; // Or inventory ID
    private boolean hivPositive;
   
}
