import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import {
  getStatusLabel,
  getStatusColor,
  FixMyStreetReport,
} from '../services/fixmystreet.service';
import { cleanReportTitle, getShortSummary } from '../utils/titleUtils';
import { useRecentReports } from '../hooks/useRecentReports';
import { RefreshButton } from '../components/RefreshButton';

const { width, height } = Dimensions.get('window');

// Council coordinates mapping
const COUNCIL_COORDINATES: { [key: string]: { latitude: number; longitude: number } } = {
  'Camden': { latitude: 51.5392, longitude: -0.1426 },
  'Westminster': { latitude: 51.4975, longitude: -0.1357 },
  'Islington': { latitude: 51.5465, longitude: -0.1058 },
  'Hackney': { latitude: 51.5450, longitude: -0.0553 },
  'Tower Hamlets': { latitude: 51.5099, longitude: -0.0059 },
  'Manchester': { latitude: 53.4808, longitude: -2.2426 },
  'Birmingham': { latitude: 52.4862, longitude: -1.8904 },
  'Leeds': { latitude: 53.8008, longitude: -1.5491 },
  'Liverpool': { latitude: 53.4084, longitude: -2.9916 },
  'Bristol': { latitude: 51.4545, longitude: -2.5879 },
  'Edinburgh': { latitude: 55.9533, longitude: -3.1883 },
  'Glasgow': { latitude: 55.8642, longitude: -4.2518 },
  'Cardiff': { latitude: 51.4816, longitude: -3.1791 },
  'Belfast': { latitude: 54.5973, longitude: -5.9301 },
};

interface MapViewScreenProps {
  council?: string;
  mode?: 'view' | 'selectLocation'; // Add mode for pin placement
  initialLocation?: { latitude: number; longitude: number }; // Initial pin location for selectLocation mode
  onBack?: () => void;
  onViewDetails?: (issueId: string, reportData?: any) => void;
  onFilterTune?: () => void;
  onLayersControl?: () => void;
  onImagePreview?: (issueId: string) => void;
  onLocationSelected?: (location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
  }) => void; // Callback for selected location with address
}

interface IssueMarker {
  id: string;
  title: string;
  location: string;
  distance: string;
  status: 'In Progress' | 'Resolved' | 'Received' | 'Open' | 'Fixed';
  statusColor: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  type: 'pothole' | 'bench' | 'lamp' | 'flooding';
  icon: string;
  iconColor: string;
  image?: any | null;
  reporters: number;
  rawData?: any;
}

const MapViewScreen: React.FC<MapViewScreenProps> = ({
  council = 'Camden',
  mode = 'view',
  initialLocation,
  onBack,
  onViewDetails,
  onFilterTune,
  onLayersControl,
  onImagePreview,
  onLocationSelected
}) => {
  const mapRef = useRef<MapView>(null);
  const [selectedFilter, setSelectedFilter] = useState('All Issues');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<IssueMarker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(
    initialLocation || null
  );
  const [selectedAddress, setSelectedAddress] = useState<{ address: string; city: string } | null>(null);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  const [markersReady, setMarkersReady] = useState(false);

  // Map filter to API status
  const statusFilter = useMemo(() => {
    if (selectedFilter === 'Open') return 'open';
    if (selectedFilter === 'Fixed') return 'closed';
    if (selectedFilter === 'In Progress') return 'investigating';
    return undefined;
  }, [selectedFilter]);

  // Use cached reports (only in view mode)
  const { reports: rawReports, loading, lastUpdated, refresh } = useRecentReports(
    mode === 'view' ? council : '',
    { status: statusFilter, limit: 100 }
  );

  // Get council coordinates or use default (Camden)
  const getCouncilCoordinates = () => {
    const coords = COUNCIL_COORDINATES[council];
    return coords || COUNCIL_COORDINATES['Camden'];
  };

  const getMarkerType = (category: string): 'pothole' | 'bench' | 'lamp' | 'flooding' => {
    if (category.toLowerCase().includes('pothole') || category.toLowerCase().includes('road')) return 'pothole';
    if (category.toLowerCase().includes('light')) return 'lamp';
    if (category.toLowerCase().includes('flood') || category.toLowerCase().includes('water')) return 'flooding';
    return 'bench';
  };

  const getMarkerIcon = (category: string, status: string): string => {
    if (status === 'closed' || status === 'fixed') return 'check-circle';
    if (category.toLowerCase().includes('pothole')) return 'warning';
    if (category.toLowerCase().includes('light')) return 'lightbulb';
    if (category.toLowerCase().includes('flood')) return 'water-drop';
    if (category.toLowerCase().includes('tree')) return 'park';
    if (category.toLowerCase().includes('bin')) return 'delete';
    return 'location-on';
  };

  const [initialRegion, setInitialRegion] = useState({
    ...getCouncilCoordinates(),
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [currentRegion, setCurrentRegion] = useState(initialRegion);

  const filters = ['All Issues', 'Open', 'Fixed', 'In Progress'];

  // Update map region when council changes
  useEffect(() => {
    const coords = getCouncilCoordinates();
    setInitialRegion({
      ...coords,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    // Animate map to new region if map ref is available
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        ...coords,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  }, [council]);

  // Transform raw reports to map markers
  const issues = useMemo(() => {
    if (!rawReports || rawReports.length === 0) return [];

    return rawReports
      .filter((report: any) => report.lat && report.long)
      .map((report: any) => ({
        id: report.id,
        title: cleanReportTitle(report.title) || report.service_name || 'Reported Issue',
        location: getShortSummary(report.description, 50) || report.service_name || 'Location not specified',
        distance: '',
        status: getStatusLabel(report.status) as any,
        statusColor: getStatusColor(report.status),
        coordinate: {
          latitude: parseFloat(report.lat),
          longitude: parseFloat(report.long),
        },
        type: getMarkerType(report.service_code || ''),
        icon: getMarkerIcon(report.service_code || '', report.status),
        iconColor: getStatusColor(report.status),
        image: report.media_url || null,
        reporters: report.comment_count || 1,
        rawData: report,
      }));
  }, [rawReports]);

  // Reset markersReady when issues change, then set to true after delay for iOS rendering
  useEffect(() => {
    if (issues.length > 0) {
      setMarkersReady(false);
      const timer = setTimeout(() => setMarkersReady(true), 500);
      return () => clearTimeout(timer);
    }
  }, [issues.length]);

  const mockIssues: IssueMarker[] = [
    {
      id: '1',
      title: 'Deep Pothole',
      location: 'High Street',
      distance: '0.2mi away',
      status: 'In Progress',
      statusColor: '#FFD572',
      coordinate: {
        latitude: 51.5392,
        longitude: -0.1426,
      },
      type: 'pothole',
      icon: 'build',
      iconColor: '#5B7CFA',
      image: null, // Replace with actual image when available
      reporters: 3,
    },
    {
      id: '2',
      title: 'Broken Bench',
      location: 'Park Avenue',
      distance: '0.5mi away',
      status: 'Received',
      statusColor: '#9CA3AF',
      coordinate: {
        latitude: 51.5382,
        longitude: -0.1456,
      },
      type: 'bench',
      icon: 'location-on',
      iconColor: '#9CA3AF',
      reporters: 1,
    },
    {
      id: '3',
      title: 'Fixed Lamp',
      location: 'Oak Road',
      distance: '0.8mi away',
      status: 'Resolved',
      statusColor: '#4DB6AC',
      coordinate: {
        latitude: 51.5412,
        longitude: -0.1396,
      },
      type: 'lamp',
      icon: 'check-circle',
      iconColor: '#4DB6AC',
      reporters: 2,
    },
    {
      id: '4',
      title: 'Flooding',
      location: 'River Lane',
      distance: '1.2mi away',
      status: 'In Progress',
      statusColor: '#FF8C66',
      coordinate: {
        latitude: 51.5372,
        longitude: -0.1446,
      },
      type: 'flooding',
      icon: 'warning',
      iconColor: '#FF8C66',
      reporters: 5,
    },
  ];

  const handleMarkerPress = (issue: IssueMarker) => {
    setSelectedIssue(issue);
    // Center map on selected marker
    mapRef.current?.animateToRegion({
      latitude: issue.coordinate.latitude,
      longitude: issue.coordinate.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleMyLocation = () => {
    mapRef.current?.animateToRegion(initialRegion, 300);
  };

  const handleZoomIn = () => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: currentRegion.latitudeDelta / 2,
      longitudeDelta: currentRegion.longitudeDelta / 2,
    };
    setCurrentRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleZoomOut = () => {
    const newRegion = {
      ...currentRegion,
      latitudeDelta: Math.min(currentRegion.latitudeDelta * 2, 180),
      longitudeDelta: Math.min(currentRegion.longitudeDelta * 2, 360),
    };
    setCurrentRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleRegionChange = (region: any) => {
    setCurrentRegion(region);
  };

  const reverseGeocodeLocation = async (latitude: number, longitude: number) => {
    try {
      setIsGeocodingAddress(true);
      console.log('🗺️ Reverse geocoding location:', { latitude, longitude });

      const results = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (results && results.length > 0) {
        const result = results[0];
        console.log('📍 Geocoding result:', result);

        const address = [result.street, result.streetNumber].filter(Boolean).join(' ') || result.name || 'Unknown address';
        const city = result.city || result.subregion || result.region || 'Unknown city';

        console.log('✅ Formatted address:', { address, city });
        setSelectedAddress({ address, city });
        return { address, city };
      } else {
        console.log('⚠️ No geocoding results found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error reverse geocoding:', error);
      return null;
    } finally {
      setIsGeocodingAddress(false);
    }
  };

  const handleMapPress = async (event: any) => {
    // Don't handle if the press was on a marker (action will be 'marker-press')
    const action = event.nativeEvent?.action;
    if (action === 'marker-press') {
      return;
    }

    if (mode === 'selectLocation') {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setSelectedLocation({ latitude, longitude });
      await reverseGeocodeLocation(latitude, longitude);
    } else if (mode === 'view') {
      // Close the popup when tapping on the map (not on a marker)
      setSelectedIssue(null);
    }
  };

  const handlePinDragEnd = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log('📍 Pin dragged to:', { latitude, longitude });
    setSelectedLocation({ latitude, longitude });
    await reverseGeocodeLocation(latitude, longitude);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation && onLocationSelected) {
      onLocationSelected({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: selectedAddress?.address,
        city: selectedAddress?.city,
      });
      // Don't call onBack() here - let the parent handle navigation
    }
  };

  // Filter issues based on search query
  const filteredIssues = issues.filter((issue) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      issue.title.toLowerCase().includes(query) ||
      issue.location.toLowerCase().includes(query) ||
      issue.status.toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={handleMapPress}
        onRegionChangeComplete={handleRegionChange}
      >
        {/* Show issue markers only in 'view' mode */}
        {mode === 'view' && !loading && filteredIssues.map((issue, index) => (
          <Marker
            key={`${issue.id}-${index}`}
            coordinate={issue.coordinate}
            onPress={() => handleMarkerPress(issue)}
            tracksViewChanges={!markersReady || issue.id === selectedIssue?.id}
          >
            <View style={styles.markerContainer}>
              <View
                style={[
                  styles.markerIcon,
                  {
                    backgroundColor: issue.id === selectedIssue?.id ? issue.iconColor : '#FFFFFF',
                    borderColor: issue.iconColor,
                  },
                ]}
              >
                <MaterialIcons
                  name={issue.icon as any}
                  size={20}
                  color={issue.id === selectedIssue?.id ? '#FFFFFF' : issue.iconColor}
                />
              </View>
              {issue.id === selectedIssue?.id && (
                <View style={[styles.markerPulse, { backgroundColor: `${issue.iconColor}20` }]} />
              )}
            </View>
          </Marker>
        ))}

        {/* Show location pin in 'selectLocation' mode */}
        {mode === 'selectLocation' && selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            draggable
            onDragEnd={handlePinDragEnd}
          >
            <View style={styles.locationPinContainer}>
              <MaterialIcons name="place" size={48} color="#EF4444" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
            <MaterialIcons name="arrow-back" size={24} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search area or issue..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity activeOpacity={0.8} onPress={onFilterTune}>
              <MaterialIcons name="tune" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {mode === 'view' && (
            <RefreshButton
              lastUpdated={lastUpdated}
              isRefreshing={loading}
              onRefresh={refresh}
              compact
            />
          )}
        </View>

        {mode === 'view' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
            contentContainerStyle={styles.filtersContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterPill,
                  selectedFilter === filter && styles.filterPillActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {mode === 'selectLocation' && (
          <View style={styles.instructionBanner}>
            <MaterialIcons name="info-outline" size={16} color="#5B7CFA" />
            <View style={{ flex: 1 }}>
              <Text style={styles.instructionText}>Tap or drag the pin to adjust location</Text>
              {isGeocodingAddress && (
                <Text style={styles.addressText}>Finding address...</Text>
              )}
              {!isGeocodingAddress && selectedAddress && (
                <Text style={styles.addressText}>
                  {selectedAddress.address}, {selectedAddress.city}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton} activeOpacity={0.8} onPress={onLayersControl}>
          <MaterialIcons name="layers" size={20} color="#64748B" />
        </TouchableOpacity>

        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.zoomButtonTop]}
            onPress={handleZoomIn}
            activeOpacity={0.8}
          >
            <MaterialIcons name="add" size={20} color="#64748B" />
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity
            style={[styles.controlButton, styles.zoomButtonBottom]}
            onPress={handleZoomOut}
            activeOpacity={0.8}
          >
            <MaterialIcons name="remove" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.locationButton}
          onPress={handleMyLocation}
          activeOpacity={0.8}
        >
          <MaterialIcons name="my-location" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Confirm Location Button (selectLocation mode) */}
      {mode === 'selectLocation' && selectedLocation && (
        <View style={styles.confirmLocationContainer}>
          <TouchableOpacity
            style={styles.confirmLocationButton}
            onPress={handleConfirmLocation}
            activeOpacity={0.9}
          >
            <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
            <Text style={styles.confirmLocationText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Sheet - Issue Details (view mode only) */}
      {mode === 'view' && selectedIssue && (
        <View style={styles.bottomSheet}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedIssue(null)}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={20} color="#6B7280" />
          </TouchableOpacity>
          <View style={styles.issueCard}>
            <View style={styles.issueContent}>
              <TouchableOpacity style={styles.issueImage} activeOpacity={0.8} onPress={() => onImagePreview?.(selectedIssue.id)}>
                {selectedIssue.image ? (
                  <Image source={{ uri: selectedIssue.image }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <MaterialIcons name={selectedIssue.icon as any} size={32} color="#9CA3AF" />
                  </View>
                )}
                {selectedIssue.image && (
                  <View style={styles.imageOverlay}>
                    <MaterialIcons name="fullscreen" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.issueDetails}>
                <View style={styles.issueHeader}>
                  <View style={styles.issueTitleContainer}>
                    <Text style={styles.issueTitle}>{selectedIssue.title}</Text>
                    <View style={styles.issueLocation}>
                      <MaterialIcons name="place" size={14} color="#9CA3AF" />
                      <Text style={styles.issueLocationText}>
                        {selectedIssue.location}, {selectedIssue.distance}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${selectedIssue.statusColor}10` },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: selectedIssue.statusColor }]}
                    >
                      {selectedIssue.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.issueFooter}>
                  <View style={styles.reporters}>
                    <View style={styles.reporterAvatar}>
                      <Text style={styles.reporterText}>JD</Text>
                    </View>
                    <View style={styles.reporterAvatar}>
                      <Text style={styles.reporterText}>+{selectedIssue.reporters - 1}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => onViewDetails?.(selectedIssue.id, selectedIssue.rawData)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <MaterialIcons name="arrow-forward" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.swipeIndicator}>
            <View style={styles.swipeBar} />
          </View>
        </View>
      )}

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#5B7CFA" />
            <Text style={styles.loadingText}>Loading reports from {council} Council...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
  },
  map: {
    width: '100%',
    height: '100%',
  },

  // Marker Styles
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.3,
  },

  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333344',
  },
  filtersScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filtersContent: {
    gap: 8,
    paddingHorizontal: 20,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterPillActive: {
    backgroundColor: '#5B7CFA',
    borderColor: '#5B7CFA',
    shadowColor: '#5B7CFA',
    shadowOpacity: 0.3,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },

  // Map Controls
  mapControls: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -80 }],
    gap: 12,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  zoomControls: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  zoomButtonTop: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  zoomButtonBottom: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  zoomDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#5B7CFA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  closeButton: {
    position: 'absolute',
    top: -40,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  issueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  issueContent: {
    flexDirection: 'row',
    gap: 16,
  },
  issueImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  issueDetails: {
    flex: 1,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  issueTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  issueTitle: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontSize: 18,
    fontWeight: '700',
    color: '#333344',
    marginBottom: 4,
  },
  issueLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  issueLocationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reporters: {
    flexDirection: 'row',
    gap: -8,
  },
  reporterAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reporterText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#5B7CFA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#5B7CFA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  swipeIndicator: {
    alignItems: 'center',
    marginTop: 16,
  },
  swipeBar: {
    width: 128,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    opacity: 0.5,
  },

  // Loading Overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },

  // Instruction Banner (selectLocation mode)
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  instructionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5B7CFA',
  },
  addressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333344',
    marginTop: 4,
  },

  // Location Pin (selectLocation mode)
  locationPinContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Confirm Location Button
  confirmLocationContainer: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    right: 20,
  },
  confirmLocationButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  confirmLocationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default MapViewScreen;
