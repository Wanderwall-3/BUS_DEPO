package com.wande.bus_depo_backend.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.stereotype.Service;

@Service
public class SupabaseStorageService {

    private final String SUPABASE_URL = "https://vdbczxmbmzljohcjoqvt.supabase.co";
    private final String SUPABASE_BUCKET = "profile-bucket";
    private final String SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkYmN6eG1ibXpsam9oY2pvcXZ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTczOTI3OCwiZXhwIjoyMDY3MzE1Mjc4fQ.Tic0cHnUoEkhsFjLtomOKrauva9SgjlkRm584U5ov7A"; // keep this secure

    public String uploadFile(String fileName, byte[] fileData, String contentType) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SUPABASE_URL + "/storage/v1/object/" + SUPABASE_BUCKET + "/" + fileName))
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Content-Type", contentType)
                .PUT(HttpRequest.BodyPublishers.ofByteArray(fileData))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                return SUPABASE_URL + "/storage/v1/object/public/" + SUPABASE_BUCKET + "/" + fileName;
            } else {
                System.err.println("Upload failed: " + response.body());
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
