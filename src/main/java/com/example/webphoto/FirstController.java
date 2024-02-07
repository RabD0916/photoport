package com.example.webphoto;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class FirstController {
    @GetMapping("/showMe")
    public List<String> hello() {
        return Arrays.asList("정재헌", "김영우");
    }
}
