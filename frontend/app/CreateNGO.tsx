import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import ProgressCircle from "react-native-progress/Circle";
import DateTimePicker from "@react-native-community/datetimepicker";
import { submitNGOForm } from "../api/ngo.js"; // Import the API function

const { width } = Dimensions.get("window");

const steps = [
  [
    {
      label: "Profile Photo",
      placeholder: "Upload Profile Photo",
      key: "profilePhoto",
    },
  ],
  [
    { label: "NGO Name", placeholder: "Enter NGO Name", key: "name" },
    {
      label: "Established Date",
      placeholder: "Select Established Date",
      key: "establishedDate",
    },
    {
      label: "Mission Statement",
      placeholder: "Enter Mission Statement",
      key: "missionStatement",
    },
  ],
  [
    {
      label: "Contact Info",
      placeholder: "Enter Contact Info",
      key: "contactInfo",
    },
    {
      label: "Address",
      placeholder: "Enter Address",
      key: "address",
      subFields: [
        { label: "Street", placeholder: "Enter Street", key: "street" },
        { label: "City", placeholder: "Enter City", key: "city" },
        { label: "State", placeholder: "Enter State", key: "state" },
        {
          label: "Postal Code",
          placeholder: "Enter Postal Code",
          key: "postalCode",
        },
        { label: "Country", placeholder: "Enter Country", key: "country" },
      ],
    },
  ],
  [
    {
      label: "Founders",
      placeholder: "Add Founder",
      key: "founders",
      subFields: [
        { label: "Image", placeholder: "Upload Founder Image", key: "image" },
        { label: "Name", placeholder: "Enter Founder Name", key: "name" },
        {
          label: "Position",
          placeholder: "Enter Founder Position",
          key: "position",
        },
      ],
    },
    {
      label: "Categories",
      placeholder: "Select Category",
      key: "category",
    },
  ],
];

const categories = [
  "Health",
  "Education",
  "Environment",
  "Human Rights",
  "Animal Welfare",
  // Add more categories as needed
];

const NGOFormScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [position] = useState(new Animated.Value(0));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      Animated.timing(position, {
        toValue: -(width * (currentStep + 1)),
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      Animated.timing(position, {
        toValue: -(width * (currentStep - 1)),
        duration: 300,
        useNativeDriver: true,
      }).start();
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, establishedDate: date });
    setShowDatePicker(false);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSubmit = async () => {
    try {
      const response = await submitNGOForm(formData);
      console.log("Form submitted successfully:", response);
      Alert.alert("Success", "NGO Form submitted successfully!");
      setFormData({});
      setCurrentStep(0);
      position.setValue(0);
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error submitting the form. Please try again."
      );
    }
  };

  const progress = (currentStep + 1) / steps.length;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressCircle
          size={50}
          progress={progress}
          showsText
          color="#007bff"
          style={styles.progressCircle}
        />
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {steps.length}
        </Text>
      </View>
      <Animated.View
        style={[
          styles.formContainer,
          { transform: [{ translateX: position }] },
        ]}
      >
        {steps.map((step, stepIndex) => (
          <View key={stepIndex} style={styles.stepContainer}>
            {step.map((field, index) => (
              <View key={index} style={styles.fieldContainer}>
                <Text style={styles.label}>{field.label}</Text>
                {field.subFields ? (
                  field.subFields.map((subField, subIndex) => (
                    <TextInput
                      key={subIndex}
                      style={styles.input}
                      value={formData[subField.key] || ""}
                      onChangeText={(value) =>
                        handleChange(subField.key, value)
                      }
                      placeholder={subField.placeholder}
                      placeholderTextColor="#888"
                    />
                  ))
                ) : field.key === "establishedDate" ? (
                  <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateText}>
                      {formData[field.key]
                        ? formData[field.key].toLocaleDateString()
                        : field.placeholder}
                    </Text>
                  </TouchableOpacity>
                ) : field.key === "category" ? (
                  <View>
                    {categories.map((category, categoryIndex) => (
                      <TouchableOpacity
                        key={categoryIndex}
                        style={styles.categoryButton}
                        onPress={() => handleChange(field.key, category)}
                      >
                        <Text style={styles.categoryText}>{category}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <TextInput
                    style={styles.input}
                    value={formData[field.key] || ""}
                    onChangeText={(value) => handleChange(field.key, value)}
                    placeholder={field.placeholder}
                    placeholderTextColor="#888"
                    multiline={field.key === "missionStatement"}
                    numberOfLines={field.key === "missionStatement" ? 4 : 1}
                  />
                )}
              </View>
            ))}
          </View>
        ))}
      </Animated.View>
      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.button} onPress={handlePrev}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentStep < steps.length - 1 ? "Next" : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  handleChange("establishedDate", date);
                  setShowDatePicker(false); // Close the date picker after selecting a date
                }}
              />
            )}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text>Select Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  progressCircle: {
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    color: "#007bff",
  },
  formContainer: {
    flexDirection: "row",
    width: width * steps.length,
  },
  stepContainer: {
    width,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  fieldContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#333",
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
  },
  categoryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    marginBottom: 8,
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NGOFormScreen;
