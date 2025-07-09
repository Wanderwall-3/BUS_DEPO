// package com.wande.bus_depo_backend.config;

// import java.io.FileInputStream;
// import java.io.IOException;

// import org.springframework.context.annotation.Configuration;

// import com.google.auth.oauth2.GoogleCredentials;
// import com.google.firebase.FirebaseApp;
// import com.google.firebase.FirebaseOptions;

// import jakarta.annotation.PostConstruct;

// @Configuration
// public class FirebaseStorageConfig {

//     @PostConstruct
//     public void initializeFirebase() {
//         try {
//             FileInputStream serviceAccount =
//                 new FileInputStream("src/main/resources/firebase-service.json");

//             FirebaseOptions options = FirebaseOptions.builder()
//                 .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                 .setStorageBucket("wande-3be9f.firebasestorage.app") // Your bucket name
//                 .build();

//             if (FirebaseApp.getApps().isEmpty()) {
//                 FirebaseApp.initializeApp(options);
//             }

//         } catch (IOException e) {
//             e.printStackTrace();
//         }
//     }
// }
