import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { ResizeMode, Video } from "expo-av";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideo } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null as any,
    thumbnail: null as any,
    prompt: "null",
  });

  const openPicker = async (selectType: string) => {
    const type =
      selectType === "thumbnail"
        ? ["image/png", "image/jpg", "image/jpeg"]
        : ["video/mp4", "video/gif"];

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "thumbnail"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) return;

    if (selectType === "thumbnail")
      setForm({ ...form, thumbnail: result.assets[0] });
    if (selectType === "video") setForm({ ...form, video: result.assets[0] });
  };

  const submit = async () => {
    if (!form.prompt || !form.title || !form.thumbnail || !form.video)
      return Alert.alert("Please fill in all the fields");

    setUploading(true);

    try {
      await createVideo({ ...form, userId: user.$id });
      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      if (error instanceof Error) Alert.alert("Error", error?.message);
    } finally {
      setForm({
        title: "",
        video: null as any,
        thumbnail: null as any,
        prompt: "null",
      });

      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          title="Video Title"
          otherStyles="mt-10"
          value={form.title}
          placeholder="Give your video a catch title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
        />

        <View className="mt-7 space-y-2 ">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("thumbnail")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          otherStyles="mt-7"
          value={form.prompt}
          placeholder="The prompt you used to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
        />

        <CustomButton
          title="Create"
          handlePress={submit}
          containerStyles=" mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
