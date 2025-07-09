package com.wande.bus_depo_backend.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import com.wande.bus_depo_backend.service.SupabaseStorageService;


@RestController
@RequestMapping("/storage")
public class FileController {

    // @Autowired
    // private FirebaseStorageService storageService;

    @GetMapping("/check")
    public String check() {
        return "success";
    }

    @Autowired
    private SupabaseStorageService storageService;

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return storageService.uploadFile(
                file.getOriginalFilename(),
                file.getBytes(),
                file.getContentType());
    }

    // @GetMapping("/download")
    // public ResponseEntity<byte[]> downloadFile(@RequestParam String fileName) {
    //     byte[] content = storageService.downloadFile(fileName);
    //     return content != null
    //             ? ResponseEntity.ok().body(content)
    //             : ResponseEntity.notFound().build();
    // }

    @GetMapping("/firebase-status")
    public String checkFirebase() {
        try {
            Bucket bucket = StorageClient.getInstance().bucket();
            return "Firebase initialized. Bucket: " + bucket.getName();
        } catch (Exception e) {
            e.printStackTrace();
            return "Firebase NOT initialized: " + e.getMessage();
        }
    }

}
