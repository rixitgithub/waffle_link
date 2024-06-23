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
  const renderLeaderboardItem = ({ item, index }) => {
    let rankElement = null;

    if (index === 0) {
      rankElement = <View style={[styles.rankElement, styles.gold]} />;
    } else if (index === 1) {
      rankElement = <View style={[styles.rankElement, styles.silver]} />;
    } else if (index === 2) {
      rankElement = <View style={[styles.rankElement, styles.bronze]} />;
    } else {
      rankElement = <Text style={styles.rank}>{index + 1}</Text>;
    }

    return (
      <View
        style={[
          styles.itemContainer,
          item.highlighted && styles.highlightedItemContainer,
        ]}
      >
        {rankElement}
        <Text style={[styles.name, item.highlighted && styles.highlightedText]}>
          {item.name}
        </Text>
        <Text
          style={[styles.score, item.highlighted && styles.highlightedText]}
        >
          {item.score}
        </Text>
      </View>
    );
  };

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
            keyExtractor={(item) => item._id.toString()} // Assuming _id is an ObjectId
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
    paddingHorizontal: 30,
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
  highlightedItemContainer: {
    backgroundColor: "#e0f7fa",
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 5,
  },
  rankElement: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  gold: {
    backgroundColor: "#ffd700", // Gold color
  },
  silver: {
    backgroundColor: "#c0c0c0", // Silver color
  },
  bronze: {
    backgroundColor: "#cd7f32", // Bronze color
  },
  rank: {
    width: 30,
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
  highlightedText: {
    fontWeight: "bold",
    color: "#007bff",
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
