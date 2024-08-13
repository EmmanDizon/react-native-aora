import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { icons } from "@/constants";
import { Video, ResizeMode } from "expo-av";

const zoomIn = {
  0: { scale: 0.9, opacity: 0.9 },
  1: {
    scale: 1.1,
    opacity: 1,
  },
};

const zoomOut = {
  0: { scale: 1, opacity: 1 },
  1: {
    scale: 0.9,
    opacity: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }: any) => {
  const [play, setPlay] = useState(false);
  const [status, setStatus] = React.useState({});

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{
            uri: "https://player.vimeo.com/video/949579770?h=897cd5e781.mp4",
          }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/30"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if ("didJustFinish" in status && status.didJustFinish === true) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="absolute w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ data }: any) => {
  const [activeItem, setActiveItem] = useState(data[0]);

  const viewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.$id.toString()}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      horizontal
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 170, y: 170 }}
    />
  );
};

export default Trending;