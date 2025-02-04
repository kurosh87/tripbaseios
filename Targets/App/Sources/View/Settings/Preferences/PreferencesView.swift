import SwiftUI
import SharedKit

/// Main container view for all user preferences
struct PreferencesView: View {
    var body: some View {
        UserPreferencesView()
    }
}

#Preview {
    NavigationStack {
        PreferencesView()
    }
} 