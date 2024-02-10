import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createDatabase, useMigrations, notes } from "@db/expo";

const db = createDatabase("test.db");

export default function App() {
  const [note, setNote] = useState("");
  useEffect(() => {
    const fetchOneNote = async () => {
      await db.insert(notes).values({ content: "hoge", title: "fuga" });
      const result = await db.select().from(notes).limit(1);
      setNote(JSON.stringify(result));
    };
    fetchOneNote();
  }, []);
  const { success, error } = useMigrations(db);
  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>success: {success ? "true" : "false"}</Text>
      <Text>{note}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
