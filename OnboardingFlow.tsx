import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import UserDetailsScreen from './screens/UserDetailsScreen';
import RegionSelectionScreen from './screens/RegionSelectionScreen';
import CouncilSelectionScreen from './screens/CouncilSelectionScreen';
import UpdatePreferenceScreen from './screens/UpdatePreferenceScreen';

type OnboardingData = {
  name?: string;
  region?: string;
  council?: string;
  updatePreference?: number;
};

interface OnboardingFlowProps {
  onComplete?: (data?: OnboardingData) => void;
  onLogin?: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onLogin }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const handleGetStarted = () => {
    setCurrentStep(1);
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    }
  };

  const handleUserDetailsNext = (data: { name: string }) => {
    setOnboardingData({ ...onboardingData, name: data.name });
    setCurrentStep(2);
  };

  const handleUserDetailsSkip = () => {
    setCurrentStep(2);
  };

  const handleBackFromUserDetails = () => {
    setCurrentStep(0);
  };

  const handleRegionSelected = (region: string) => {
    setOnboardingData({ ...onboardingData, region });
    setCurrentStep(3);
  };

  const handleBackFromRegion = () => {
    setCurrentStep(1);
  };

  const handleCouncilSelected = (council: string) => {
    setOnboardingData({ ...onboardingData, council });
    setCurrentStep(4);
  };

  const handleBackFromCouncil = () => {
    setCurrentStep(2);
  };

  const handlePreferenceSelected = (preference: number) => {
    const finalData = { ...onboardingData, updatePreference: preference };
    setOnboardingData(finalData);
    // Onboarding complete - navigate to main app
    console.log('Onboarding complete!');
    console.log('Final data:', finalData);
    if (onComplete) {
      onComplete(finalData);
    }
  };

  const handleSkipPreference = () => {
    // Skip preference and complete onboarding
    console.log('Preference skipped');
    console.log('Final data:', onboardingData);
    if (onComplete) {
      onComplete(onboardingData);
    }
  };

  const handleBackFromPreference = () => {
    setCurrentStep(3);
  };

  const renderScreen = () => {
    switch (currentStep) {
      case 0:
        return (
          <WelcomeScreen
            onGetStarted={handleGetStarted}
            onLogin={handleLogin}
          />
        );
      case 1:
        return (
          <UserDetailsScreen
            onBack={handleBackFromUserDetails}
            onNext={handleUserDetailsNext}
            onSkip={handleUserDetailsSkip}
          />
        );
      case 2:
        return (
          <RegionSelectionScreen
            onBack={handleBackFromRegion}
            onNext={handleRegionSelected}
          />
        );
      case 3:
        return (
          <CouncilSelectionScreen
            onBack={handleBackFromCouncil}
            onNext={handleCouncilSelected}
          />
        );
      case 4:
        return (
          <UpdatePreferenceScreen
            onBack={handleBackFromPreference}
            onContinue={handlePreferenceSelected}
            onSkip={handleSkipPreference}
          />
        );
      default:
        return (
          <WelcomeScreen
            onGetStarted={handleGetStarted}
            onLogin={handleLogin}
          />
        );
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OnboardingFlow;
