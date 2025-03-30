import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { Alert, Image } from 'react-native';
import {icons} from '@/constants/icons'
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';

const search = () => {

  const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
      image: ''
    });
    const router = useRouter()

    const openCamera = async () => {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera access is required to take a picture.');
        return;
      }
  
      // Launch the camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
  
      if (!result.canceled) {

        const tempUri = result.assets[0].uri; // Temporary URI
        const fileName = tempUri.split('/').pop(); // Extract the file name
        const newPath = `${FileSystem.documentDirectory}${fileName}`; // Save to the app's document directory

        // Move the file to the persistent directory
        await FileSystem.moveAsync({
          from: tempUri,
          to: newPath,
        });

        console.log('Image saved to:', newPath);

        setForm({
          ...form,
          image: newPath, // Store the captured image URI
        });
      }
    };
  
    const openPicker = async (selectType: any) => {
      const result : any = await DocumentPicker.getDocumentAsync({
        type:
          selectType === "image"
            ? ["image/png", "image/jpg", "image/jpeg"]
            : ["video/mp4", "video/gif"],
      });

      console.log(result)
  
      if (!result.canceled) {
        if (selectType === "image") {
          setForm({
            ...form,
            image: result.assets[0].uri, // Store the image URI
          });
        }
      } else {
        setTimeout(() => {
          
        }, 100);
      }
    };

    const uploadImage = async () => {
      if (!form.image) {
        Alert.alert("No image selected", "Please select an image before uploading.");
        return;
      }
    
      const formData = new FormData();
      //@ts-ignore
      formData.append("file", {
        uri: form.image, // The URI of the image
      });
    
      try {
        setUploading(true); // Show a loading indicator if needed
    
        const response = await fetch("https://your-backend-url.com/upload", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });
    
        const result = await response.json();
    
        if (response.ok) {
          Alert.alert("Upload Successful", "Your image has been uploaded.");
        } else {
          Alert.alert("Upload Failed", result.message || "Something went wrong.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while uploading the image. " + error);
      } finally {
        setUploading(false); // Hide the loading indicator
      }
    };

    const handleSubmit = () => {
      if (form.image) {
        router.push({ pathname: '/chat', params: { image: form.image }})
      } else {
        Alert.alert("No image selected", "Please select an image before submitting.");
      }
    }

  return (
    <>
    <View className='mx-8 mt-12'>
      <Text className='font-interExtraBold text-3xl text-zinc-800'>Take a Photo</Text>

      <View className='my-8 flex-col'>

        <View className=''>
            <Text className='font-interSemiBold text-zinc-500'>Take picture</Text>
            <TouchableOpacity onPress={() => openCamera()}>
              {form.image ? (
                <Image source={{
                  uri: form.image,
                }}
                resizeMode={"cover"}
                className='w-full h-96 rounded-2xl mt-4'/> )
                :
                <View className='w-full h-96 mt-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center'>
                <View className='w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center'>
                  <Entypo name="camera" size={24} color="black" />
                </View>
              </View>}
            </TouchableOpacity>
          </View>

        <View className='mt-4'>
            <Text className='font-interSemiBold text-zinc-500'>Upload Photo</Text>
            <TouchableOpacity onPress={() => openPicker("image")} className='bg-zinc-100 rounded-lg py-4 mt-1'>

                <View className="w-full h-40 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                    <Image
                      source={icons.upload}
                      resizeMode="contain"
                      alt="upload"
                      className="w-1/2 h-1/2"
                    />
                  </View>
                </View>

            </TouchableOpacity>
        </View>

        

        <View className='mt-2'>
          <TouchableOpacity onPress={() =>  handleSubmit()} className=' rounded-full border-[2px] border-black bg-black py-1.5 px-5 text-white text-center flex items-center justify-center'>
            <Text className='text-white font-inter'>{uploading ? 'Submitting' : "Submit"}</Text>
          </TouchableOpacity>
        </View>

      </View>
    
    </View>
  
    </>
  )
}

export default search