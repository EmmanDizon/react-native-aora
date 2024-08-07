import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

interface IField {
  title: string;
  value: string;
  otherStyles: string;
  placeholder?: string;
  handleChangeText: (e: string) => void;
  keyboardType?: string;
}

const FormField = ({
  title,
  value,
  otherStyles,
  keyboardType,
  placeholder,
  handleChangeText,
}: IField) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <TextInput
          className="flex-1 text-white font-psemibold text-base"
          placeholder={placeholder}
          value={value}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPass}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Image
              source={!showPass ? icons.eye : icons.eyeHide}
              className="w-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
