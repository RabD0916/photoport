package com.example.webphoto.service;

import com.example.webphoto.domain.Media;
import com.example.webphoto.domain.User;
import com.example.webphoto.dto.GetMedia;
import com.example.webphoto.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaService {
    private final String path = "./front4/public/images/";
    private final MediaRepository mediaRepository;
    private final UserService userService;

    public String create(String nowUser, String nowCate, String selectedMedia) {
        User user = userService.findById(nowUser);
        String[] mediaNames = selectedMedia.split("[\\[\\],]");
        for(int i=1; i<mediaNames.length-2; i++) {
            mediaRepository.save(new Media(null, mediaNames[i].replaceAll("\"", ""), LocalDateTime.now(), nowCate, user));
        }
        return "Success";
    }

    public List<GetMedia> send(String nowUser, String cateName) {
        String dir = path + nowUser + "/" + cateName;
        System.out.println(dir);
        String[] mediaNames = getFileNames(dir);
        System.out.println(Arrays.asList(mediaNames));
        List<GetMedia> getMediaList = new ArrayList<>();
        if(mediaNames != null) {
            for (String mediaName : mediaNames) {
                getMediaList.add(new GetMedia(mediaName, cateName));
            }
        }
        System.out.println(getMediaList);
        return getMediaList;
    }

    public String move(String nowUser, String nowCate, String selectedMedia, String nextCateName) {
        String[] mediaNames = selectedMedia.split(",");
        for(String mediaName : mediaNames) {
            String prevDir = path + nowUser + "/" + nowCate + "/" + mediaName;
            Path prevPath = Paths.get(prevDir);
            Path nextPath = Paths.get(path + nowUser + "/" +
                    URLEncoder.encode(nextCateName, StandardCharsets.UTF_8).replaceAll("%", "&") + "/" + mediaName);
            try {
                Files.move(prevPath, nextPath, StandardCopyOption.ATOMIC_MOVE);
                deleteFile(prevDir);
            } catch(Exception e) {
                e.printStackTrace();
                return "Fail";
            }
        }
        return "Success";
    }

    public String delete(String nowUser, String nowCate, String selectedMedia) {
        String[] arr = selectedMedia.split(",");
        for(String mediaName : arr) {
            String dir = path + nowUser + "/" + nowCate + "/" + mediaName;
            String result = deleteFile(dir);
            if(!result.equals("Success")) {
                return result;
            }
        }
        return "Success";
    }

    public String[] getFileNames(String dir) {
        File folder = new File(dir);
        return folder.list();
    }

    private String deleteFile(String dir) {
        File file = new File(dir);
        if (file.exists()) {
            return file.delete() ? "Success" : "Fail";
        } else {
            return "Not Exist";
        }
    }
}
