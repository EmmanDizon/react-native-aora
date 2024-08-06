import { TouchableOpacity, Text } from "react-native";

interface ICustomButton {
  title: string;
  containerStyles?: string;
  isLoading: boolean;
  textStyles?: string;
  handlePress?: () => void;
}

const CustomButton = ({
  title,
  containerStyles,
  isLoading,
  textStyles,
  handlePress,
}: ICustomButton) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`font-psemibold text-lg ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
