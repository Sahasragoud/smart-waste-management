package com.smart_waste_management.backend.dto;

import lombok.Data;

@Data
public class UploadResponse {
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String filePath;
    private Long userId;
    private String category;
    private Double confidence;
    private String guidance;  // optional for frontend


    public UploadResponse(String fileName, String fileType, Long fileSize, String filePath, Long userId, String category, Double confidence, String guidance) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.filePath = filePath;
        this.userId = userId;
        this.category = category;
        this.confidence = confidence;
        this.guidance = guidance;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
