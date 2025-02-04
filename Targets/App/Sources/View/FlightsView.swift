//
//  FlightsView.swift
//  App
//

import SwiftUI
import SharedKit

struct FlightsView: View {
    var body: some View {
        NavigationStack {
            VStack {
                Text("Map View Coming Soon")
                    .font(.title)
                    .padding()
                
                Text("We're working on integrating the map view.")
                    .foregroundColor(.gray)
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

#Preview {
    FlightsView()
}