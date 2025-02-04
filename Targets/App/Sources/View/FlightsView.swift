//
//  FlightsView.swift
//  App
//

import SwiftUI
import SharedKit
import MapKit
import CoreLocation

struct FlightsView: View {
    // Location manager for user location
    @StateObject private var locationManager = LocationManager()
    
    // State for map region
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 37.3346, longitude: -122.0090), // Default to Apple Park
        span: MKCoordinateSpan(latitudeDelta: 0.2, longitudeDelta: 0.2)
    )
    
    // State for map type
    @State private var mapType: MKMapType = .standard
    
    var body: some View {
        NavigationStack {
            Map(
                coordinateRegion: $region,
                showsUserLocation: true,
                userTrackingMode: .constant(.follow),
                mapStyle: mapType == .standard ? .standard : .hybrid
            )
            .ignoresSafeArea(edges: .vertical)
            .overlay(alignment: .bottomTrailing) {
                VStack(spacing: 10) {
                    Button(action: {
                        mapType = mapType == .standard ? .hybrid : .standard
                    }) {
                        Image(systemName: mapType == .standard ? "map" : "map.fill")
                            .padding()
                            .background(Color(.systemBackground))
                            .clipShape(Circle())
                            .shadow(radius: 4)
                    }
                    
                    Button(action: {
                        if let location = locationManager.location {
                            withAnimation {
                                region.center = location.coordinate
                            }
                        }
                    }) {
                        Image(systemName: "location.fill")
                            .padding()
                            .background(Color(.systemBackground))
                            .clipShape(Circle())
                            .shadow(radius: 4)
                    }
                }
                .padding()
            }
            .navigationTitle("Flights")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        // TODO: Implement search
                    }) {
                        Image(systemName: "magnifyingglass")
                    }
                }
            }
        }
    }
}

// Location Manager to handle user location
class LocationManager: NSObject, ObservableObject, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()
    @Published var location: CLLocation?
    
    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        location = locations.last
    }
}

#Preview {
    FlightsView()
}