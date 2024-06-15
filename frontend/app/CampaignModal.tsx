import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons from react-native-vector-icons

const CampaignModal = ({ visible, onClose, type }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [endDate, setEndDate] = useState(new Date());
  const [volunteerCount, setVolunteerCount] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [engagements, setEngagements] = useState("");
  const [expectations, setExpectations] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCreateCampaign = () => {
    // Handle campaign creation logic here based on type
    console.log({
      title,
      description,
      goal,
      currency,
      endDate,
      volunteerCount,
      skillsRequired,
      engagements,
      expectations,
      type,
    });
    onClose();
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
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerIcon}
        >
          <Icon name="calendar-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>
            {endDate.toLocaleDateString()} {/* Display selected date */}
          </Text>
        </TouchableOpacity>
      </View>
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
      <TextInput
        style={styles.input}
        placeholder="Skills Required"
        value={skillsRequired}
        onChangeText={setSkillsRequired}
      />
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerIcon}
        >
          <Icon name="calendar-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>
            {endDate.toLocaleDateString()} {/* Display selected date */}
          </Text>
        </TouchableOpacity>
      </View>
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
        placeholder="Target Engagements (e.g., shares, likes)"
        value={engagements}
        onChangeText={setEngagements}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Expectations"
        value={expectations}
        onChangeText={setExpectations}
      />
      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.datePickerIcon}
        >
          <Icon name="calendar-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>
            {endDate.toLocaleDateString()} {/* Display selected date */}
          </Text>
        </TouchableOpacity>
      </View>
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

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateCampaign}
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
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  datePickerIcon: {
    paddingHorizontal: 10,
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
