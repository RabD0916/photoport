package com.example.webphoto.service;

import com.example.webphoto.domain.Tag;
import com.example.webphoto.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;

    public List<Tag> addTag(String[] tagNames) {
        List<Tag> tags = new ArrayList<>();
        for(String tagName : tagNames) {
            Tag saved = tagRepository.save(new Tag(null, tagName));
            tags.add(saved);
        }
        return tags;
    }

    public boolean existsByName(String tagName) {
        return tagRepository.existsByName(tagName);
    }

}
