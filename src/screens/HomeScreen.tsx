import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Breeds } from "../interfaces/Breeds";
import { CatFacts } from "../interfaces/CatFacts";

const aboutCats = axios.create({
  baseURL: "https://catfact.ninja",
});
export default function HomeScreen() {
  const [data, setData] = useState<CatFacts>();
  const [pageNum, setPageNum] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const facts = async () => {
      try {
        const response = await aboutCats.get<CatFacts>(`/facts?page=${pageNum}`)
        setIsLoading(false)
        setData(response.data)
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    facts()
  }, [pageNum]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color={"blue"} />
        <Text>Loading ...</Text>
      </SafeAreaView>
    );
  }
  return (
    <View>
      <FlatList
        data={data?.data}
        initialNumToRender={10}
        keyExtractor={(item) => item.fact}
        renderItem={({ item }) => {
          return (
            <View
              key={item.fact}
              style={{
                padding: 10,
                backgroundColor: "white",
                margin: 5,
                borderRadius: 5,
                elevation: 5,
              }}
            >
              <Text>{item.fact}</Text>
            </View>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <View style={{ padding: 5 }}>
              <Text style={{ textAlign: "center", fontSize: 18 }}>
                Page : {pageNum}
              </Text>
            </View>
          );
        }}
        ListFooterComponent={() => {
          return (
            <View
              style={{
                flexDirection: "row-reverse",
                justifyContent: "space-evenly",
                padding: 5,
                margin: 5,
              }}
            >
              <Button
                title="to Next Page"
                onPress={() => {
                  setPageNum(pageNum + 1);
                  setIsLoading(true);
                }}
                disabled={pageNum === 34}
              />
              <Button
                title="to Previous Page"
                onPress={() => {
                  setPageNum(pageNum - 1);
                  setIsLoading(true);
                }}
                disabled={pageNum === 1}
              />
            </View>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    justifyContent: "center",
    alignItems: "center",
  },
});
