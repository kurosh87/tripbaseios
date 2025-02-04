//
//  SettingsView.swift
//	App (Generated by SwiftyLaunch 1.5.0)
//  https://docs.swiftylaun.ch/module/app/views/app-settings
//

import AnalyticsKit
import FirebaseKit
import InAppPurchaseKit
import NotifKit
import SharedKit
import SwiftUI

struct SettingsView: View {

	@EnvironmentObject var iap: InAppPurchases
	@EnvironmentObject var db: DB

	/// Settings NavigationStack. Be careful not to wrap NavigationStack inside another NavigationStack. This may lead to weird bugs.
	@State private var settingsPath = NavigationPath()

	/// We pass this function to closures that may need a dismiss action, to return back to the root settings view
	/// For example, user has an account -> goes to account settings -> deletes an account, so we forward him back to root
	func popToRoot() {
		settingsPath = NavigationPath()
	}

	var body: some View {
		NavigationStack(path: $settingsPath) {
			List {
				// Account Section (AuthKit)
				Section {
					NavigationLink(value: SettingsPath.account) {
						AccountRow()
					}
				}

				// Sleep & Routine Preferences Section
				Section {
					NavigationLink(value: SettingsPath.preferences) {
						SettingsRowItem(.preferences)
					}
				}

				// General Settings Sections
				Section {
					let generalSettings: [SettingsPath] = [
						.general,
						.notifications,
						/// NotifKit Section
						.appearance,
						/// Requires Premium to access (otherwise will show the premium sheet on tap)
						.privacy,
					]
					ForEach(generalSettings, id: \.data.iconName) { setting in
						SettingsRowItem(setting)
					}
				}

				/// Purchase Premium / Manage Premium Settings Section (InAppPurchaseKit)
				Section {
					NavigationLink(value: SettingsPath.premium) {
						PremiumRow()
					}
				}

				#if DEBUG
				// Developer Settings Section (Debug Only)
				Section("DEVELOPER") {
					NavigationLink(value: SettingsPath.developer) {
						HStack(spacing: 15) {
							Image(systemName: "hammer.fill")
								.foregroundStyle(.white)
								.font(.callout)
								.frame(width: 25, height: 25)
								.background(Color.indigo.gradient)
								.clipShape(RoundedRectangle(cornerRadius: 5, style: .continuous))
							Text("Developer Settings")
						}
					}
				}
				#endif

				// Developer Contact Section
				Section {
					LinkRow(
						url: URL(string: "\(Constants.AppData.developerWebsite)")!,
						setting: .aboutDeveloper
					)
					.captureTaps(
						"\(SettingsPath.aboutDeveloper.data.analyticsDescription)_settings_row",
						fromView: "SettingsView")
					LinkRow(
						url: URL(string: "mailto:\(Constants.AppData.supportEmail)")!, setting: .reportBug
					)
					.captureTaps(
						"\(SettingsPath.reportBug.data.analyticsDescription)_settings_row",
						fromView: "SettingsView")
				} footer: {
					Text("© \(Date.now, format: .dateTime.year()), \(Constants.AppData.developerName)")
				}

			}
			.navigationTitle("Settings")
			.navigationDestination(for: SettingsPath.self) { setting in
				switch setting {
					case .account:
						// AuthKit + DBKit
						AccountSettingsView(popBackToRoot: popToRoot)
					case .notifications:
						// NotifKit
						NotificationsSettingsView()
					case .appearance:
						// Note: Requires Premium (When InAppPurchaseKit is enabled)
						AppearanceView(popBackToRoot: popToRoot)
					case .premium:
						// InAppPurchaseKit
						if iap.subscriptionState == .subscribed {
							PremiumSettingsView(popBackToRoot: popToRoot)
						} else {
							InAppPurchaseView(onCanceled: popToRoot) {}
						}
					case .privacy:
						PrivacyView()
					case .developer:
						DeveloperSettingsView()
					case .preferences:
						PreferencesView()
					default:
						// If an undefined destination -> Show a Text with the setting label
						ZStack {
							Text(setting.data.label)
						}
						.navigationTitle(setting.data.label)
				}
			}
		}
		.captureViewActivity(as: "SettingsView")
	}
}

struct SettingsRowItem: View {

	let setting: SettingsPath

	init(_ setting: SettingsPath) {
		self.setting = setting
	}

	var body: some View {
		NavigationLink(value: setting) {
			HStack(spacing: 15) {
				Image(systemName: setting.data.iconName)
					.foregroundStyle(setting.data.iconForegroundColor)
					.font(.callout)
					.frame(width: 25, height: 25)
					.background(setting.data.iconBackgroundColor.gradient)
					.clipShape(RoundedRectangle(cornerRadius: 5, style: .continuous))
				Text(setting.data.label)
			}
		}
	}
}

struct AccountRow: View {

	@EnvironmentObject var db: DB

	var body: some View {
		HStack(alignment: .center, spacing: 10) {

			ProfileImage(url: db.currentUser?.photoURL, width: 45)

			VStack(alignment: .leading, spacing: 0) {
				Text(db.authState == .signedIn ? (db.currentUser!.displayName ?? "USERNAME") : "Your Account")
					.font(.title2)
					.lineLimit(1)
				Text(db.authState == .signedIn ? "Account Settings" : "Tap here to Sign In")
					.font(.caption)
					.foregroundStyle(.secondary)
					.lineLimit(1)
			}
		}
	}
}

struct PremiumRow: View {

	@EnvironmentObject var iap: InAppPurchases

	var body: some View {
		HStack(alignment: .center, spacing: 10) {
			Image(systemName: "star.fill")
				.foregroundStyle(Color.white)
				.font(.title3)
				.frame(width: 40, height: 40)
				.background(
					.conicGradient(
						colors: [.purple, .accentColor, .red, .green, .accentColor], center: .topLeading)
				)
				.squircle(width: 40)

			VStack(alignment: .leading, spacing: 0) {
				Text(iap.subscriptionState == .subscribed ? "Premium Access Unlocked" : "Unlock Premium Features")
					.font(.headline)
				Text(iap.subscriptionState == .subscribed ? "Tap here to Manage" : "Tap here to learn more")
					.font(.caption2)
					.foregroundStyle(.secondary)
			}
		}
	}
}

/// Same as SettingsRowItem but with a URL Link
struct LinkRow: View {

	let url: URL
	let setting: SettingsPath

	var body: some View {
		Link(
			destination: url,
			label: {
				SettingsRowItem(setting)
			}
		)
		.buttonStyle(.borderless)
		.foregroundStyle(.primary)

	}
}

/// View for managing sleep and routine preferences
fileprivate struct PreferencesView: View {
	@AppStorage("wakeUpTime") private var wakeUpTime = Calendar.current.date(from: DateComponents(hour: 7, minute: 0)) ?? Date()
	@AppStorage("bedTime") private var bedTime = Calendar.current.date(from: DateComponents(hour: 23, minute: 0)) ?? Date()
	@AppStorage("chronotype") private var chronotype = "Bear (Middle of the Road)"
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
			
			Section(header: Text("Sleep Type")) {
				Picker("Sleep Type", selection: $chronotype) {
					Text("Lion (Early Bird)").tag("Lion (Early Bird)")
					Text("Bear (Middle of the Road)").tag("Bear (Middle of the Road)")
					Text("Wolf (Night Owl)").tag("Wolf (Night Owl)")
					Text("Dolphin (Light Sleeper)").tag("Dolphin (Light Sleeper)")
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

enum SettingsPath: Hashable, Equatable {
	case account
	case general
	case notifications
	case appearance
	case privacy
	case premium
	case aboutDeveloper
	case reportBug
	case developer
	case preferences

	var data: SettingsRowData {
		switch self {
			case .account:
				SettingsRowData(iconName: "person.fill", label: "Account", analyticsDescription: "account")
			case .general:
				SettingsRowData(iconName: "gear", label: "General", analyticsDescription: "general")
			case .notifications:
				SettingsRowData(
					iconName: "bell.badge.fill", iconBackgroundColor: Color.red, label: "Notifications",
					analyticsDescription: "notifications")
			case .appearance:
				SettingsRowData(
					iconName: "paintbrush.fill", iconBackgroundColor: .purple, label: "Appearance",
					analyticsDescription: "appearance")
			case .privacy:
				SettingsRowData(
					iconName: "hand.raised.fill", iconBackgroundColor: .blue, label: "Privacy",
					analyticsDescription: "privacy")
			case .premium:
				SettingsRowData(iconName: "star.fill", label: "Premium", analyticsDescription: "premium")
			case .aboutDeveloper:
				SettingsRowData(
					iconName: "hammer.fill", iconBackgroundColor: .blue, label: "About the Developer",
					analyticsDescription: "about_developer")
			case .reportBug:
				SettingsRowData(
					iconName: "exclamationmark.bubble.fill", iconBackgroundColor: .orange,
					label: "Report a Problem", analyticsDescription: "report_problem")
			case .developer:
				SettingsRowData(
					iconName: "hammer.fill", iconBackgroundColor: .indigo, label: "Developer Settings",
					analyticsDescription: "developer_settings")
			case .preferences:
				SettingsRowData(
					iconName: "moon.stars.fill", iconBackgroundColor: .indigo, label: "Sleep & Routine",
					analyticsDescription: "user_preferences")
		}
	}
}

public struct SettingsRowData: Hashable {
	let id = UUID()
	var iconName: String = "gear"
	var iconForegroundColor: Color = Color.white
	var iconBackgroundColor: Color = Color.gray
	var label: LocalizedStringKey
	var analyticsDescription: String

	// to conform to hashable
	public func hash(into myhasher: inout Hasher) {
		myhasher.combine(id)
	}
}

#Preview {
	SettingsView()
		.environmentObject(DB())
		.environmentObject(InAppPurchases())
}
