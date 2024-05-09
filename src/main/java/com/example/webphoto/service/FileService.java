package com.example.webphoto.service;

import com.example.webphoto.dto.FileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    // 파일 저장 디렉토리 경로
    @Value("${file.dir}")
    private String fileDir;

    //파일을 업로드 하는 메소드
    public String uploadFile(MultipartFile file) {
        // 전달된 파일이 비어있지 않은 경우
        if(!file.isEmpty()) {
            // UUID를 사용하여 파일명을 생성
            String uuid = UUID.randomUUID().toString();
            String savedName = uuid + "_" + file.getOriginalFilename();

            // 저장될 파일 객체 생성
            File dest = new File(fileDir, savedName);

            try {
                // 파일을 지정된 경로에 저장
                file.transferTo(dest);
                return savedName; // 저장된 파일명 반환
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null; // 파일이 비어있는 경우 또는 저장 실패 시 null 반환
    }

    // 파일을 다운로드하는 메소드
    public FileResponse getFile(String name) {
        FileResponse res = new FileResponse();
        try {
            // 지정된 파일명으로 파일 객체 생성
            File file = new File(fileDir, name);

            // 파일의 내용을 byte 배열로 읽어와 FileResponse에 설정
            res.setBytes(FileCopyUtils.copyToByteArray(file));

            // 파일의 MINE 타입을 설정
            res.setContentType(Files.probeContentType(file.toPath()));
        } catch (Exception e) {
            // 파일을 읽어오는 중에 오류 발생 시 예외 처리
            e.printStackTrace();
        }
        return res; // 파일의 내용과 MINE 타입이 설정된 FileResponse 반환
    }
}
