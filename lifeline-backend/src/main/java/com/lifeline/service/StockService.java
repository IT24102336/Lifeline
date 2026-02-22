package com.lifeline.service;

import com.lifeline.model.Inventory;
import com.lifeline.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StockService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public List<Inventory> getAllStock() {
        return inventoryRepository.findAll();
    }

    // Run daily at midnight to check for expired stock
    
}
