//
//  FlightsView.swift
//  App
//

import SwiftUI
import SharedKit

struct FlightsView: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "airplane")
                    .font(.system(size: 60))
                    .foregroundColor(.blue)
                    .padding()
                
                Text("Flights Coming Soon")
                    .font(.title2)
                
                Text("This feature is under development")
                    .foregroundColor(.gray)
            }
            .navigationTitle("Flights")
        }
    }
}

#Preview {
    FlightsView()
} 