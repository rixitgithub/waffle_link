import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Campaign } from "./types";

type Props = {
  campaigns: Campaign[];
};

const MyCampaigns: React.FC<Props> = ({ campaigns }) => {
  console.log("campaigns", campaigns);

  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderCampaignDetails = (campaign: Campaign) => {
    switch (campaign.type) {
      case "fundraising":
        return (
          <>
            <Text style={styles.campaignDetails}>
              Goal: ${campaign.goal} | Raised: ${campaign.currentAmount}
            </Text>
          </>
        );
      case "volunteer":
        return (
          <>
            <Text style={styles.campaignDetails}>
              Volunteers Needed: {campaign.volunteerCount}
            </Text>
          </>
        );
      case "awareness":
        return (
          <>
            <Text style={styles.campaignDetails}>
              Target Shares: {campaign.shares}
            </Text>
            <Text style={styles.campaignDetails}>
              Target Likes: {campaign.likes}
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  const renderProgress = (campaign: Campaign) => {
    switch (campaign.type) {
      case "fundraising":
        const progress = campaign.goal
          ? (campaign.currentAmount / campaign.goal) * 100
          : 0;
        return (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Progress: {progress.toFixed(2)}%
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressIndicator, { width: `${progress}%` }]}
              />
            </View>
          </View>
        );
      case "volunteer":
        return (
          <Text style={styles.progressText}>
            Volunteers Recruited: {campaign.volunteerCount}
          </Text>
        );
      case "awareness":
        return (
          <Text style={styles.progressText}>
            Shares: {campaign.shares} | Likes: {campaign.likes}
          </Text>
        );
      default:
        return null;
    }
  };

  const renderCampaignIcon = (type: string) => {
    switch (type) {
      case "fundraising":
        return <Icon name="hand-heart" size={24} color="#FF6347" />;
      case "volunteer":
        return <Icon name="account-group" size={24} color="#1E90FF" />;
      case "awareness":
        return <Icon name="bullhorn" size={24} color="#32CD32" />;
      default:
        return null;
    }
  };

  // Sort campaigns by createdAt date in descending order
  const sortedCampaigns = [...campaigns].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Campaigns</Text>
      {sortedCampaigns.map((campaign) => (
        <View key={campaign._id} style={styles.campaign}>
          <View style={styles.iconContainer}>
            {renderCampaignIcon(campaign.type)}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.campaignTitle}>{campaign.title}</Text>
            <Text style={styles.campaignDescription}>
              {campaign.description}
            </Text>
            {renderCampaignDetails(campaign)}
            <Text style={styles.dateText}>
              Created: {formatDate(campaign.createdAt)}
            </Text>
            {campaign.endDate && (
              <Text style={styles.dateText}>
                Ends: {formatDate(campaign.endDate)}
              </Text>
            )}
            {renderProgress(campaign)}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  campaign: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  iconContainer: {
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  campaignDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  campaignDetails: {
    fontSize: 14,
    color: "#666",
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 5,
  },
  progressIndicator: {
    height: "100%",
    backgroundColor: "#FF6347",
  },
  progressText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
    marginTop: 3,
  },
});

export default MyCampaigns;
