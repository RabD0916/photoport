package com.example.webphoto;

import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
public class GalleryController {
    private final String path = "./front4/public/images/";
    private String nowUser = "";
    private String nowCate = "";

    @GetMapping("/sendCategory/{userId}")
    public String[][] sendCategory(@PathVariable String userId) {
        String dir = path + userId;
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
            this.nowUser = userId;
        }
        return cateInfo;
    }

    @GetMapping("/sendMedia/{cateName}")
    public String[] sendMedia(@PathVariable String cateName) {
        String dir = path + nowUser + "/" + cateName;
        String[] mediaNames = getFileNames(dir);

        if(mediaNames == null) {
            mediaNames = new String[1];
            mediaNames[0] = "Media Not Found";
        } else {
            nowCate = cateName;
        }
        return mediaNames;
    }

    @PostMapping("/createCategory/{cateName}")
    public String createCategory(@PathVariable String cateName) {
        String dir = path + nowUser + "/" + cateName;
        File folder = new File(dir);
        String result;
        if(!folder.exists()) {
            result = folder.mkdir() ? "Success" : "Fail";
        } else {
            result = "Already Exist";
        }
        return result;
    }

    @DeleteMapping("/deleteCategory/{cateName}")
    public String deleteCategory(@PathVariable String cateName) {
        String dir = path + nowUser + "/" + cateName;
        return delete(dir);
    }

    @DeleteMapping("/forceDeleteCategory/{cateName}")
    public String forceDeleteCategory(@PathVariable String cateName) {
        String dir = path + nowUser + "/" + cateName;
        for(String mediaName : getFileNames(dir)) {
            String mediaDir = dir + "/" + mediaName;
            String result = delete(mediaDir);
            if(!result.equals("Success")) {
                return result;
            }
        }
        return delete(dir);
    }

    @PatchMapping("/moveMedia/{nextCateName}/{mediaNames}")
    public String moveMedia(@PathVariable String nextCateName, @PathVariable String mediaNames) {
        String[] arr = mediaNames.split(",");
        for(String mediaName : arr) {
            String prevDir = path + nowUser + "/" + nowCate + "/" + mediaName;
            Path prevPath = Paths.get(prevDir);
            Path nextPath = Paths.get(path + nowUser + "/" + nextCateName + "/" + mediaName);
            try {
                Files.move(prevPath, nextPath, StandardCopyOption.ATOMIC_MOVE);
                delete(prevDir);
            } catch(Exception e) {
                e.printStackTrace();
                return "Fail";
            }
        }
        return "Success";
    }

    @DeleteMapping("/deleteMedia/{mediaNames}")
    public String deleteMedia(@PathVariable String mediaNames) {
        String[] arr = mediaNames.split(",");
        for(String mediaName : arr) {
            String dir = path + nowUser + "/" + nowCate + "/" + mediaName;
            String result = delete(dir);
            if(!result.equals("Success")) {
                return result;
            }
        }
        return "Success";
    }

    public String delete(String dir) {
        File file = new File(dir);
        if(file.exists()) {
            return file.delete() ? "Success" : "Fail";
        } else {
            return "Not Exist";
        }
    }

    public String[] getFileNames(String dir) {
        File folder = new File(dir);
        return folder.list();
    }
}
