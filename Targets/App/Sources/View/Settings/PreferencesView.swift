import SwiftUI
import SharedKit

/// Represents different chronotype options for sleep patterns
enum Chronotype: String, CaseIterable {
    case lion = "Lion (Early Bird)"
    case bear = "Bear (Middle of the Road)"
    case wolf = "Wolf (Night Owl)"
    case dolphin = "Dolphin (Light Sleeper)"
    
    var description: String {
        switch self {
        case .lion:
            return "Early risers, most alert in the morning"
        case .bear:
            return "Follow the solar cycle, peak productivity mid-morning"
        case .wolf:
            return "Most alert in the evening, creative at night"
        case .dolphin:
            return "Light sleepers, peak productivity in bursts"
        }
    }
}

/// Main preferences view that handles all user preferences
struct PreferencesView: View {
    @AppStorage("wakeUpTime") private var wakeUpTime = Calendar.current.date(from: DateComponents(hour: 7, minute: 0)) ?? Date()
    @AppStorage("bedTime") private var bedTime = Calendar.current.date(from: DateComponents(hour: 23, minute: 0)) ?? Date()
    @AppStorage("chronotype") private var chronotype = Chronotype.bear.rawValue
    @AppStorage("usesMelatonin") private var usesMelatonin = false
    @AppStorage("caffeineCutoffTime") private var caffeineCutoffTime = Calendar.current.date(from: DateComponents(hour: 14, minute: 0)) ?? Date()
    @AppStorage("maxCaffeineIntake") private var maxCaffeineIntake = 400 // in mg
    
    var body: some View {
        Form {
            Section(header: Text("Sleep Schedule")) {
                DatePicker("Wake Up Time",
                          selection: $wakeUpTime,
                          displayedComponents: .hourAndMinute)
                
                DatePicker("Bed Time",
                          selection: $bedTime,
                          displayedComponents: .hourAndMinute)
            }
            
            Section(header: Text("Sleep Type"),
                    footer: Text(Chronotype(rawValue: chronotype)?.description ?? "")) {
                Picker("Chronotype", selection: $chronotype) {
                    ForEach(Chronotype.allCases, id: \.rawValue) { type in
                        Text(type.rawValue).tag(type.rawValue)
                    }
                }
            }
            
            Section(header: Text("Sleep Aids")) {
                Toggle("Uses Melatonin", isOn: $usesMelatonin)
                if usesMelatonin {
                    Text("Remember to take melatonin 2 hours before bed time")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            
            Section(header: Text("Caffeine Management")) {
                DatePicker("Caffeine Cutoff Time",
                          selection: $caffeineCutoffTime,
                          displayedComponents: .hourAndMinute)
                
                Stepper("Max Daily Caffeine: \(maxCaffeineIntake)mg",
                        value: $maxCaffeineIntake,
                        in: 0...1000,
                        step: 50)
                
                Text("Recommended max is 400mg per day")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
        }
        .navigationTitle("Sleep & Routine")
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    NavigationStack {
        PreferencesView()
    }
} 