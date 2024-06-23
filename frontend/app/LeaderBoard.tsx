import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { fetchLeaderboardData } from "../api/user"; // Adjust path as per your project structure

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const PAGE_SIZE = 15; // Number of items per page

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await fetchLeaderboardData();
      setLeaderboardData(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch leaderboard data. Please try again later.");
      setLoading(false);
    }
  };

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
    if (loading) {
      return <ActivityIndicator size="large" color="#007bff" />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

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
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <FlatList
            data={leaderboardData.slice(startIndex, endIndex)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderLeaderboardItem}
            contentContainerStyle={styles.listContainer}
          />
          {renderPaginationControls()}
        </>
      )}
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
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

export default LeaderboardScreen;
