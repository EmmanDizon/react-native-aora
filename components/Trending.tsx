import { View, Text, FlatList } from "react-native";
import React from "react";

interface Props {
  posts: { id: number }[];
}

const Trending = ({ posts }: Props) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Text className="text-white">{item.id}</Text>}
      horizontal
    />
  );
};

export default Trending;
