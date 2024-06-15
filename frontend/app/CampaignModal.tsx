import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";

const CampaignModal = ({ visible, onClose, type }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [endDate, setEndDate] = useState(new Date());
  const [volunteerCount, setVolunteerCount] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [shares, setShares] = useState("");
  const [likes, setLikes] = useState("");

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [
    title,
    description,
    goal,
    currency,
    endDate,
    volunteerCount,
    shares,
    likes,
    skills,
  ]);

  const validateForm = () => {
    switch (type) {
      case "fundraising":
        setIsFormValid(title !== "" && description !== "" && goal !== "");
        break;
      case "volunteer":
        setIsFormValid(
          title !== "" && description !== "" && volunteerCount !== ""
        );
        break;
      case "awareness":
        setIsFormValid(
          title !== "" && description !== "" && shares !== "" && likes !== ""
        );
        break;
      default:
        setIsFormValid(false);
        break;
    }
  };

  const handleCreateCampaign = () => {
    console.log({
      title,
      description,
      goal,
      currency,
      endDate,
      volunteerCount,
      skills,
      shares,
      likes,
      type,
    });
    onClose();
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const renderFundraisingFields = () => (
    <>
      <View style={styles.currencyContainer}>
        <Text style={styles.currencyLabel}>Currency:</Text>
        <Picker
          selectedValue={currency}
          style={styles.currencyPicker}
          onValueChange={(itemValue) => setCurrency(itemValue)}
        >
          <Picker.Item label="USD" value="USD" />
          <Picker.Item label="EUR" value="EUR" />
          <Picker.Item label="GBP" value="GBP" />
          <Picker.Item label="INR" value="INR" />
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Fundraising Goal"
        value={goal}
        onChangeText={setGoal}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>
          {endDate.toLocaleDateString()} {/* Display selected date */}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}
    </>
  );

  const renderVolunteerFields = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Number of Volunteers Needed"
        value={volunteerCount}
        onChangeText={setVolunteerCount}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>
          {endDate.toLocaleDateString()} {/* Display selected date */}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}
    </>
  );

  const renderAwarenessFields = () => (
    <>
      <TextInput
        style={styles.input}
        placeholder="Target Shares"
        value={shares}
        onChangeText={setShares}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Target Likes"
        value={likes}
        onChangeText={setLikes}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>
          {endDate.toLocaleDateString()} {/* Display selected date */}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}
    </>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.modalContainer}>
        <Text style={styles.modalTitle}>Create {type} Campaign</Text>

        <TextInput
          style={styles.input}
          placeholder="Campaign Title"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />

        {type === "fundraising" && renderFundraisingFields()}
        {type === "volunteer" && renderVolunteerFields()}
        {type === "awareness" && renderAwarenessFields()}

        {type === "volunteer" && (
          <View style={styles.skillsContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter skill"
              value={newSkill}
              onChangeText={setNewSkill}
            />
            <TouchableOpacity onPress={handleAddSkill}>
              <Icon name="add-circle-outline" size={30} color="#007bff" />
            </TouchableOpacity>
          </View>
        )}
        {type === "volunteer" && (
          <View style={styles.skillsList}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.createButton, !isFormValid && styles.disabledButton]}
          onPress={handleCreateCampaign}
          disabled={!isFormValid}
        >
          <Text style={styles.createButtonText}>Create Campaign</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  currencyContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  currencyLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  currencyPicker: {
    flex: 1,
    height: 40,
  },
  skillsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  skillItem: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: "#333",
  },
  dateText: {
    fontSize: 16,
    paddingVertical: 10,
    color: "#333",
  },
  createButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#ccc", // Change the disabled button style as needed
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CampaignModal;
