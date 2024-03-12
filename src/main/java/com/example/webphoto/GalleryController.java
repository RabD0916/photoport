package com.example.webphoto;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.HashMap;

@RestController
public class GalleryController {
    @GetMapping("/sendCategory/{userId}")
    public String[][] send(@PathVariable String userId) {
        String dir = "./front4/public/images/" + userId;
        String[] cateNames = getFileNames(dir);
        String[][] cateInfo;

        if(cateNames == null) {
            cateInfo = new String[1][1];
            cateInfo[0][0] = "Folder Not Found";
        } else {
            cateInfo = new String[cateNames.length][2];
            for (int i=0; i<cateNames.length; i++) {
                String[] mediaNames = getFileNames(dir + "/" + cateNames[i]);
                cateInfo[i][0] = cateNames[i];
                if (mediaNames.length < 1) {
                    cateInfo[i][1] = "Empty";
                } else {
                    cateInfo[i][1] = mediaNames[0];
                }
            }
        }
        return cateInfo;
    }

    @GetMapping("/sendMedia/{userId}/{cateId}")
    public String[] send(@PathVariable String userId, @PathVariable String cateId) {
        String dir = "./front4/public/images/" + userId + "/" + cateId;
        String[] mediaNames = getFileNames(dir);

        if(mediaNames == null) {
            mediaNames = new String[1];
            mediaNames[0] = "Media Not Found";
        }
        return mediaNames;
    }

    public String[] getFileNames(String dir) {
        File folder = new File(dir);
        return folder.list();
    }
}
