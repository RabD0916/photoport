package com.example.webphoto.service;

import com.example.webphoto.domain.Media;
import com.example.webphoto.domain.User;
import com.example.webphoto.dto.MediaResponse;
import com.example.webphoto.repository.MediaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
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
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaService {
    private final String path = "./front4/public/images/";
    private final MediaRepository mediaRepository;
    private final UserService userService;

    // 미디어 생성
    public String create(String nowUser, String nowCate, String selectedMedia) {
        User user = userService.findById(nowUser);
        String[] mediaNames = selectedMedia.split("[\\[\\],]");
        for (int i = 1; i < mediaNames.length - 1; i++) {
            mediaRepository.save(Media.builder()
                    .name(mediaNames[i].replaceAll("\"", ""))
                    .date(LocalDateTime.now())
                    .category(nowCate)
                    .owner(user)
                    .build());
        }
        return "Success";
    }

    // 미디어 전송
    public List<MediaResponse> send(String nowUser, String cateName) {
        String dir = path + nowUser + "/" + cateName;
        String[] mediaNames = getFileNames(dir);
        List<MediaResponse> mediaResponseList = new ArrayList<>();
        if (mediaNames != null) {
            for (String mediaName : mediaNames) {
                mediaResponseList.add(new MediaResponse(mediaName, cateName));
            }
        }
        return mediaResponseList;
    }

    // 미디어 이동
    public String move(String nowUser, String nowCate, String selectedMedia, String nextCateName) {
        String[] mediaNames = selectedMedia.split(",");
        for (String mediaName : mediaNames) {
            String prevDir = path + nowUser + "/" + nowCate + "/" + mediaName;
            Path prevPath = Paths.get(prevDir);
            Path nextPath = Paths.get(path + nowUser + "/" + URLEncoder.encode(nextCateName, StandardCharsets.UTF_8).replaceAll("%", "&") + "/" + mediaName);
            try {
                Files.move(prevPath, nextPath, StandardCopyOption.ATOMIC_MOVE);
                deleteFile(prevDir);
            } catch (IOException e) {
                log.error("File move error: {}", e.getMessage());
                return "Fail";
            }
        }
        return "Success";
    }

    // 미디어 삭제
    public String delete(String nowUser, String nowCate, String selectedMedia) {
        String[] arr = selectedMedia.split(",");
        for (String mediaName : arr) {
            String dir = path + nowUser + "/" + nowCate + "/" + mediaName;
            String result = deleteFile(dir);
            if (!result.equals("Success")) {
                return result;
            }
        }
        return "Success";
    }

    // 디렉토리 내 파일 이름 목록 가져오기
    public String[] getFileNames(String dir) {
        File folder = new File(dir);
        return folder.list();
    }

    // 파일 삭제
    private String deleteFile(String dir) {
        File file = new File(dir);
        if (file.exists()) {
            return file.delete() ? "Success" : "Fail";
        } else {
            return "Not Exist";
        }
    }

    // 포즈 사진을 저장하는 메소드
    public Media addPose(String userId, String fileURL) {
        User res = userService.findById(userId);
        if (res == null) {
            throw new EntityNotFoundException("해당 유저를 찾을 수 없습니다");
        }
        return mediaRepository.save(Media.builder()
                .name(fileURL)
                .date(LocalDateTime.now())
                .category("pose")
                .owner(res)
                .build());
    }
}
