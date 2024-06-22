import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CampaignModal from "./CampaignModal"; // Import CampaignModal component
import PostModal from "./PostModal"; // Import PostModal component
import UpdateModal from "./UpdateModal"; // Import UpdateModal component

const CreateOptions: React.FC = () => {
  const [campaignModalVisible, setCampaignModalVisible] = useState(false);
  const [campaignType, setCampaignType] = useState<null | string>(null);

  const [postModalVisible, setPostModalVisible] = useState(false);

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateType, setUpdateType] = useState<null | string>(null);

  const openCampaignModal = (type: string) => {
    setCampaignType(type);
    setCampaignModalVisible(true);
  };

  const openPostModal = () => {
    setPostModalVisible(true);
  };

  const openUpdateModal = () => {
    setUpdateModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.option}
        onPress={() => openCampaignModal("fundraising")}
      >
        <Text style={styles.optionText}>Create Fundraising Campaign</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => openCampaignModal("volunteer")}
      >
        <Text style={styles.optionText}>
          Create Volunteer Recruitment Campaign
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => openCampaignModal("awareness")}
      >
        <Text style={styles.optionText}>Create Awareness Campaign</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={openPostModal}>
        <Text style={styles.optionText}>Create Post</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={openUpdateModal}>
        <Text style={styles.optionText}>Add Update</Text>
      </TouchableOpacity>

      {/* CampaignModal component */}
      <CampaignModal
        visible={campaignModalVisible}
        onClose={() => setCampaignModalVisible(false)}
        type={campaignType}
      />

      {/* PostModal component */}
      <PostModal
        visible={postModalVisible}
        onClose={() => setPostModalVisible(false)}
      />

      {/* UpdateModal component */}
      <UpdateModal
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  option: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
  },
});

export default CreateOptions;
