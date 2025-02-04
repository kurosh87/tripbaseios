//
//  FlightsView.swift
//  App
//

import SwiftUI
import SharedKit

struct FlightsView: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 30) {
                Spacer()
                
                // Empty state illustration
                VStack(spacing: 15) {
                    Image(systemName: "airplane.circle.fill")
                        .font(.system(size: 80))
                        .foregroundStyle(.blue.gradient)
                        .symbolEffect(.bounce)
                    
                    Image(systemName: "arrow.triangle.2.circlepath")
                        .font(.system(size: 30))
                        .foregroundColor(.gray)
                }
                .padding(.bottom, 20)
                
                // Empty state message
                VStack(spacing: 12) {
                    Text("No Flights Yet")
                        .font(.title2)
                        .fontWeight(.semibold)
                    
                    Text("Add your upcoming flights to see them here")
                        .font(.body)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                }
                
                // Call to action button
                Button(action: {
                    // TODO: Implement add flight action
                }) {
                    HStack {
                        Image(systemName: "plus.circle.fill")
                        Text("Add Flight")
                    }
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: 200)
                    .padding()
                    .background(Color.blue)
                    .clipShape(RoundedRectangle(cornerRadius: 15))
                }
                .padding(.top, 20)
                
                Spacer()
            }
            .padding()
            .navigationTitle("Flights")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        // TODO: Implement search action
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