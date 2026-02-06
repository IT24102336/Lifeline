package com.lifeline.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/camps")
@CrossOrigin(origins = "http://localhost:5173")
public class CampController {

    // Using a static list to simulate persistence for this session
    private static List<Map<String, Object>> camps = new ArrayList<>();

    static {
        Map<String, Object> camp1 = new HashMap<>();
        camp1.put("id", 1);
        camp1.put("name", "Colombo Camp");
        camp1.put("location", "Colombo City Centre");
        camp1.put("date", "2026-03-10");
        camp1.put("time", "09:00");
        camp1.put("lat", 6.9271);
        camp1.put("lng", 79.8612);
        camp1.put("interestCount", 0);
        camps.add(camp1);

        Map<String, Object> camp2 = new HashMap<>();
        camp2.put("id", 2);
        camp2.put("name", "Kandy Drive");
        camp2.put("location", "Kandy City Center");
        camp2.put("date", "2026-03-15");
        camp2.put("time", "10:30");
        camp2.put("lat", 7.2906);
        camp2.put("lng", 80.6337);
        camp2.put("interestCount", 0);
        camps.add(camp2);

        Map<String, Object> camp3 = new HashMap<>();
        camp3.put("id", 3);
        camp3.put("name", "Galle Donation Event");
        camp3.put("location", "Galle Fort");
        camp3.put("date", "2026-03-20");
        camp3.put("time", "08:30");
        camp3.put("lat", 6.0535);
        camp3.put("lng", 80.2210);
        camp3.put("interestCount", 0);
        camps.add(camp3);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCamps() {
        return ResponseEntity.ok(camps);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createCamp(@RequestBody Map<String, Object> campData) {
        // Simple ID generation
        int newId = camps.size() + 1;
        campData.put("id", newId);

        // Ensure defaults if missing
        if (!campData.containsKey("lat")) campData.put("lat", 6.9271);
        if (!campData.containsKey("lng")) campData.put("lng", 79.8612);
        if (!campData.containsKey("time")) campData.put("time", "09:00");
        if (!campData.containsKey("interestCount")) campData.put("interestCount", 0);

        camps.add(campData);
        return ResponseEntity.ok(campData);
    }

    @PostMapping("/{id}/interest")
    public ResponseEntity<Map<String, Object>> registerInterest(@PathVariable int id) {
        for (Map<String, Object> camp : camps) {
            Object campId = camp.get("id");
            if (campId != null && Integer.parseInt(campId.toString()) == id) {
                int current = 0;
                if (camp.get("interestCount") != null) {
                    current = Integer.parseInt(camp.get("interestCount").toString());
                }
                camp.put("interestCount", current + 1);
                return ResponseEntity.ok(camp);
            }
        }
        return ResponseEntity.notFound().build();
    }
}
