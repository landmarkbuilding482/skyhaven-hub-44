import { useState, useEffect } from 'react';

interface FeedbackDropdownOptions {
  type: string[];
  category: string[];
  status: string[];
  assigned_to: string[];
}

// Global state to share dropdown options across components
let globalFeedbackOptions: FeedbackDropdownOptions = {
  type: ["Complaint", "Feedback", "Suggestion"],
  category: ["Maintenance", "Billing", "Security", "Amenities", "Noise", "Parking", "Cleanliness", "Staff", "Other"],
  status: ["In Progress", "Under Review", "Closed"],
  assigned_to: ["Building Manager", "Maintenance Team", "Security", "Admin", "Customer Service"]
};

export const useFeedbackDropdowns = () => {
  const [dropdownOptions, setDropdownOptions] = useState<FeedbackDropdownOptions>(globalFeedbackOptions);

  const updateDropdownOptions = (newOptions: FeedbackDropdownOptions) => {
    globalFeedbackOptions = newOptions;
    setDropdownOptions(newOptions);
    // Trigger update for all components using this hook
    window.dispatchEvent(new CustomEvent('feedbackDropdownsUpdated', { detail: newOptions }));
  };

  useEffect(() => {
    const handleDropdownUpdate = (event: CustomEvent) => {
      setDropdownOptions(event.detail);
    };

    window.addEventListener('feedbackDropdownsUpdated', handleDropdownUpdate as EventListener);
    
    return () => {
      window.removeEventListener('feedbackDropdownsUpdated', handleDropdownUpdate as EventListener);
    };
  }, []);

  return {
    dropdownOptions,
    updateDropdownOptions
  };
};