import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const PAGE_SIZE = 15; // Number of items per page

  useEffect(() => {
    // Simulated leaderboard data (replace with actual API call or data fetch)
    const data = [
      { id: 1, name: "John Doe", score: 250 },
      { id: 2, name: "Jane Smith", score: 200 },
      { id: 3, name: "Alice Johnson", score: 180 },
      { id: 4, name: "Bob Brown", score: 150 },
      { id: 5, name: "Eve Green", score: 120 },
      { id: 6, name: "Chris Lee", score: 100 },
      { id: 7, name: "Sophia Wilson", score: 90 },
      { id: 8, name: "Michael Davis", score: 80 },
      { id: 9, name: "Olivia Martinez", score: 70 },
      { id: 10, name: "David Taylor", score: 60 },
      { id: 11, name: "Emma Brown", score: 55 },
      { id: 12, name: "Noah Garcia", score: 50 },
      { id: 13, name: "Ava Hernandez", score: 45 },
      { id: 14, name: "Liam Martinez", score: 40 },
      { id: 15, name: "Isabella Clark", score: 35 },
      { id: 16, name: "James White", score: 30 },
      { id: 17, name: "Sophia Harris", score: 25 },
      { id: 18, name: "Logan Wilson", score: 20 },
      { id: 19, name: "Mia King", score: 15 },
      { id: 20, name: "Alexander Young", score: 10 },
      { id: 21, name: "Emily Moore", score: 9 },
      { id: 22, name: "Benjamin Scott", score: 8 },
      { id: 23, name: "Chloe Young", score: 7 },
      { id: 24, name: "William Lopez", score: 6 },
      { id: 25, name: "Amelia Baker", score: 5 },
      { id: 26, name: "Daniel White", score: 4 },
      { id: 27, name: "Madison Johnson", score: 3 },
      { id: 28, name: "Jackson Hall", score: 2 },
      { id: 29, name: "Grace Moore", score: 1 },
      { id: 30, name: "Lucas Wright", score: 0 },
      { id: 31, name: "Sophie Thompson", score: 300 },
      { id: 32, name: "William Brown", score: 280 },
      { id: 33, name: "Ava Johnson", score: 270 },
      { id: 34, name: "Oliver Wilson", score: 260 },
      { id: 35, name: "Charlotte Martinez", score: 240 },
      { id: 36, name: "Mason Taylor", score: 230 },
      { id: 37, name: "Amelia Clark", score: 220 },
      { id: 38, name: "Jacob White", score: 210 },
      { id: 39, name: "Sophia Harris", score: 200 },
      { id: 40, name: "Logan King", score: 190 },
    ];

    setLeaderboardData(data);
  }, []);

  // Function to render leaderboard item
  const renderLeaderboardItem = ({ item }) => (
    <View
      style={[
        styles.itemContainer,
        item.id <= 3 && styles.topThreeItemContainer,
      ]}
    >
      <Text style={[styles.rank, item.id <= 3 && styles.topThreeText]}>
        {item.id}
      </Text>
      <Text style={[styles.name, item.id <= 3 && styles.topThreeText]}>
        {item.name}
      </Text>
      <Text style={[styles.score, item.id <= 3 && styles.topThreeText]}>
        {item.score}
      </Text>
    </View>
  );

  // Function to render pagination controls
  const renderPaginationControls = () => {
    const totalPages = Math.ceil(leaderboardData.length / PAGE_SIZE);

    // Array to generate page numbers
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
      <View style={styles.paginationContainer}>
        {/* Previous page button */}
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          disabled={currentPage === 1}
        >
          <Text style={styles.paginationText}>{"<"}</Text>
        </TouchableOpacity>

        {/* Page numbers */}
        {pages.map((page) => (
          <TouchableOpacity
            key={page}
            style={[
              styles.paginationButton,
              currentPage === page && styles.paginationActive,
            ]}
            onPress={() => setCurrentPage(page)}
          >
            <Text
              style={[
                styles.paginationText,
                currentPage === page && styles.paginationActiveText,
              ]}
            >
              {page}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Next page button */}
        <TouchableOpacity
          style={styles.paginationButton}
          onPress={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <Text style={styles.paginationText}>{">"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Calculate the index range to slice leaderboardData for the current page
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  return (
    <View style={styles.container}>
      <FlatList
        data={leaderboardData.slice(startIndex, endIndex)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLeaderboardItem}
        contentContainerStyle={styles.listContainer}
      />
      {renderPaginationControls()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  topThreeItemContainer: {
    backgroundColor: "#ffe6e6",
  },
  rank: {
    width: 50,
    textAlign: "center",
    fontSize: 18,
  },
  name: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  score: {
    width: 80,
    textAlign: "right",
    fontSize: 18,
  },
  topThreeText: {
    fontWeight: "bold",
    color: "#ff4500",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  paginationButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
  },
  paginationText: {
    fontSize: 16,
  },
  paginationActive: {
    backgroundColor: "#007bff",
  },
  paginationActiveText: {
    color: "#fff",
  },
});

export default LeaderboardScreen;
