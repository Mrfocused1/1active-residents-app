/**
 * Cloudinary Service
 * Handles image upload and optimization
 * Documentation: https://cloudinary.com/documentation/react_native_image_and_video_upload
 */

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { API_CONFIG } from './api.config';

export interface ImageUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  resourceType: string;
  createdAt: string;
  bytes: number;
  thumbnailUrl?: string;
}

export interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  type?: string;
  base64?: string;
}

class CloudinaryService {
  private cloudName = API_CONFIG.CLOUDINARY.CLOUD_NAME;
  private uploadPreset = API_CONFIG.CLOUDINARY.UPLOAD_PRESET;
  private uploadUrl = `${API_CONFIG.CLOUDINARY.UPLOAD_URL}/${this.cloudName}/image/upload`;

  /**
   * Check if Cloudinary is configured
   * @returns true if cloud name and upload preset are set
   */
  isConfigured(): boolean {
    return !!this.cloudName && !!this.uploadPreset;
  }

  /**
   * Request camera permissions
   * @returns true if permission granted
   */
  async requestCameraPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  /**
   * Request media library permissions
   * @returns true if permission granted
   */
  async requestMediaLibraryPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      return false;
    }
  }

  /**
   * Pick an image from the device's gallery
   * @param allowsEditing - Allow user to edit/crop the image
   * @returns Image picker result
   */
  async pickImage(allowsEditing: boolean = false): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        throw new Error('Media library permission not granted');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type,
      };
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  }

  /**
   * Take a photo using the device camera
   * @param allowsEditing - Allow user to edit/crop the photo
   * @returns Image picker result
   */
  async takePhoto(allowsEditing: boolean = false): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        throw new Error('Camera permission not granted');
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type,
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  /**
   * Resize and compress an image
   * @param imageUri - URI of the image to resize
   * @param maxWidth - Maximum width (default: 1600px)
   * @param compressionQuality - Compression quality 0-1 (default: 0.7)
   * @returns Resized image URI
   */
  async resizeImage(
    imageUri: string,
    maxWidth: number = 1600,
    compressionQuality: number = 0.7
  ): Promise<string> {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: maxWidth } }],
        { compress: compressionQuality, format: ImageManipulator.SaveFormat.JPEG }
      );

      return manipResult.uri;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  }

  /**
   * Upload an image to Cloudinary
   * @param imageUri - Local URI of the image to upload
   * @param options - Upload options (folder, tags, etc.)
   * @returns Upload result with public URL
   */
  async uploadImage(
    imageUri: string,
    options?: {
      folder?: string;
      tags?: string[];
      resize?: boolean;
      maxWidth?: number;
      compressionQuality?: number;
    }
  ): Promise<ImageUploadResult> {
    try {
      if (!this.isConfigured()) {
        throw new Error(
          'Cloudinary not configured. Please set CLOUD_NAME and UPLOAD_PRESET in api.config.ts'
        );
      }

      // Optionally resize image before upload
      let finalUri = imageUri;
      if (options?.resize !== false) {
        finalUri = await this.resizeImage(
          imageUri,
          options?.maxWidth || 1600,
          options?.compressionQuality || 0.7
        );
      }

      // Prepare form data
      const formData = new FormData();
      const filename = finalUri.split('/').pop() || 'photo.jpg';

      // Append image file
      formData.append('file', {
        uri: finalUri,
        type: 'image/jpeg',
        name: filename,
      } as any);

      formData.append('upload_preset', this.uploadPreset);

      // Optional parameters
      if (options?.folder) {
        formData.append('folder', options.folder);
      }

      if (options?.tags && options.tags.length > 0) {
        formData.append('tags', options.tags.join(','));
      }

      // Upload to Cloudinary
      const response = await fetch(this.uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cloudinary upload failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Generate thumbnail URL (200px wide)
      const thumbnailUrl = data.secure_url.replace(
        '/upload/',
        '/upload/c_thumb,w_200,h_200,g_face/'
      );

      return {
        url: data.url,
        secureUrl: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        resourceType: data.resource_type,
        createdAt: data.created_at,
        bytes: data.bytes,
        thumbnailUrl,
      };
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images to Cloudinary
   * @param imageUris - Array of local image URIs
   * @param options - Upload options
   * @returns Array of upload results
   */
  async uploadMultipleImages(
    imageUris: string[],
    options?: {
      folder?: string;
      tags?: string[];
      resize?: boolean;
      maxWidth?: number;
      compressionQuality?: number;
    }
  ): Promise<ImageUploadResult[]> {
    try {
      const uploadPromises = imageUris.map((uri) => this.uploadImage(uri, options));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  }

  /**
   * Delete an image from Cloudinary (requires API key)
   * Note: This requires server-side implementation for security
   * @param publicId - Public ID of the image to delete
   */
  async deleteImage(publicId: string): Promise<boolean> {
    console.warn(
      'Image deletion should be implemented server-side for security. Public ID:',
      publicId
    );
    // This should be implemented on your backend
    return false;
  }
}

export default new CloudinaryService();
